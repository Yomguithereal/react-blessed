/* @flow */
import type { HostConfig, Reconciler } from 'react-fiber-types';

const {
  debounce
} = require('lodash');
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
    // pretty sure everything is absolutely positioned so insertBefore ~= append
    parentInstance.append(child);
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
    instance.screen.debouncedRender();
  },

  commitMount(
    instance : Instance,
    type : string,
    newProps : Props,
    internalInstanceHandle : Object
  ) {
    throw new Error('commitMount not implemented. Please post a reproducible use case that calls this method at https://github.com/Yomguithereal/react-blessed/issues/new');
    instance.screen.debouncedRender();
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
    textInstance.screen.debouncedRender();
  },

  prepareForCommit() {
    // noop
  },
  resetAfterCommit() {
    // noop
  },
  scheduleAnimationCallback() {
    throw new Error('Unimplemented');
  },
  scheduleDeferredCallback(a) {
    throw new Error('Unimplemented');
  },
  useSyncScheduling: true,
});

module.exports = {
  render(element, screen, callback) {
    let root = roots.get(screen);
    if (!root) {
      root = BlessedReconciler.createContainer(screen);
      roots.set(screen, root);
    }

    // render at most every 16ms. Should sync this with the screen refresh rate
    // probably if possible
    screen.debouncedRender = debounce(() => screen.render(), 16);
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

