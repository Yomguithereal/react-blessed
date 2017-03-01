/* @flow */
import type { HostConfig, Reconciler } from 'react-fiber-types';

const blessed = require('blessed');
const ReactFiberReconciler : (
  hostConfig: HostConfig<*, *, *, *, *, *, *, *>
) => Reconciler<*, *, *> = require('react-dom/lib/ReactFiberReconciler');

const update = require('../shared/update').default;
const solveClass = require('../shared/solveClass').default;
const {
  injectInternals
} = require('react-dom/lib/ReactFiberDevToolsHook');

const emptyObject = {};

const BlessedReconciler = ReactFiberReconciler({
  createInstance(
    type : string,
    props : Props,
    rootContainerInstance : Container,
    hostContext : HostContext,
    internalInstanceHandle : Object
  ) {
    const {children, ...appliedProps} = solveClass(props);
    return blessed[type](appliedProps);
  },

  appendInitialChild(
    parentInstance : Instance,
    child : Instance | TextInstance
  ) : void {
    parentInstance.append(child);
  },

  appendChild(
    parentInstance : Instance | Container,
    child : Instance | TextInstance
  ) : void {
    parentInstance.append(child);
  },

  removeChild(
    parentInstance : Instance | Container,
    child : Instance | TextInstance
  ) : void {
    parentInstance.remove(child);
  },

  insertBefore(
    parentInstance : Instance | Container,
    child : Instance | TextInstance,
    beforeChild : Instance | TextInstance
  ) : void {

  },

  finalizeInitialChildren(
    instance : Instance,
    type : string,
    props : Props,
    rootContainerInstance : Container
  ) : boolean {
    const {children, ...appliedProps} = solveClass(props);
    update(instance, appliedProps);
    return false;
  },

  prepareUpdate(
    instance : Instance,
    type : string,
    oldProps : Props,
    newProps : Props,
    rootContainerInstance : Container,
    hostContext : HostContext
  ) : null | Array<mixed> {
    return solveClass(newProps);
  },

  commitUpdate(
    instance : Instance,
    updatePayload : Array<mixed>,
    type : string,
    oldProps : Props,
    newProps : Props,
    internalInstanceHandle : Object,
  ) : void {
    update(instance, updatePayload);
  },

  commitMount(
    instance : Instance,
    type : string,
    newProps : Props,
    internalInstanceHandle : Object
  ) {
    // noop
  },

  getRootHostContext(rootContainerInstance : Container) : HostContext {
    return emptyObject;
  },
  getChildHostContext(parentHostContext : HostContext, type: string) : HostContext {
    return emptyObject;
  },
  getPublicInstance(instance) {
    return instance;
  },

  shouldSetTextContent(props : Props) : boolean {
    return false;
  },

  resetTextContent(instance : Instance) : void {
    instance.setContent('');
  },

  createTextInstance(
    text : string,
    rootContainerInstance : Container,
    hostContext : HostContext,
    internalInstanceHandle : OpaqueHandle
  ) : TextInstance {
    return blessed.text({content: text});
  },

  commitTextUpdate(
    textInstance : TextInstance,
    oldText : string,
    newText : string
  ) : void {
    textInstance.setContent(newText);
  },

  prepareForCommit() {
    // noop
  },
  resetAfterCommit() {
    a.render();
    // noop
  },
  scheduleAnimationCallback() {
    throw new Error('Unimplemented');
  },
  scheduleDeferredCallback() {
    throw new Error('Unimplemented');
  },
  useSyncScheduling: true,
});

let a = null;
module.exports = {
  render(element, screen, callback) {
    let root = roots.get(screen);
    if (!root) {
      root = BlessedReconciler.createContainer(screen);
      roots.set(screen, root);
    }
    a = screen;

    BlessedReconciler.updateContainer((element : any), root, null, callback);
    return BlessedReconciler.getPublicRootInstance(root);
  }
};

const roots = new Map();

if (typeof injectInternals === 'function') {
  injectInternals({
    findFiberByHostInstance: () => null,// BlessedReconciler.getClosestInstanceFromNode,
    findHostInstanceByFiber: BlessedReconciler.findHostInstance,
  });
}

