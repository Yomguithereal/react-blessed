/* @flow */
import type { HostConfig, Reconciler } from 'react-fiber-types';
import ReactFiberReconciler from 'react-reconciler'
import updateEventRegistrations from './events'
import update from '../shared/update'
import solveClass from '../shared/solveClass'
import debounce from 'lodash/debounce'
import injectIntoDevToolsConfig from './devtools'

const emptyObject = {};
let runningEffects = [];

export const createBlessedRenderer = function(blessed) {
  type Instance = {
    type: string,
    props: Object,
    _eventListener: Function,
    _updating: boolean,
    screen: typeof blessed.Screen,
  };

  const BlessedReconciler = ReactFiberReconciler({
    supportsMutation: true,
    supportsPersistence: false,
    useSyncScheduling: true,

    getRootHostContext(rootContainerInstance : Container) : HostContext {
      return emptyObject;
    },
    getChildHostContext(parentHostContext : HostContext, type: string) : HostContext {
      return emptyObject;
    },
    getPublicInstance(instance) {
      return instance;
    },

    createInstance(
      type : string,
      props : Props,
      rootContainerInstance : Container,
      hostContext : HostContext,
      internalInstanceHandle : Object
    ) {
      const {children, ...appliedProps} = solveClass(props);
      const blessedTypePrefix = 'blessed-';
      if (type.startsWith(blessedTypePrefix)) {
        type = type.slice(blessedTypePrefix.length);
      }

      const instance = blessed[type](appliedProps);
      instance.props = props;

      return instance;
    },

    appendInitialChild(
      parentInstance : Instance,
      child : Instance | TextInstance
    ) : void {
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
      updateEventRegistrations(rootContainerInstance, instance, appliedProps);
      instance.props = props;
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

    shouldSetTextContent(props : Props) : boolean {
      return false;
    },

    shouldDeprioritizeSubtree(type: string, props: Props): boolean {
      return !!props.hidden;
    },

    now: Date.now,

    createTextInstance(
      text : string,
      rootContainerInstance : Container,
      hostContext : HostContext,
      internalInstanceHandle : OpaqueHandle
    ) : TextInstance {
      return blessed.text({content: text});
    },

    scheduleDeferredCallback(a) {
      throw new Error('Unimplemented');
    },

    prepareForCommit() {
      // noop
    },

    resetAfterCommit() {
      // noop
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

    commitUpdate(
      instance : Instance,
      updatePayload : Array<mixed>,
      type : string,
      oldProps : Props,
      newProps : Props,
      internalInstanceHandle : Object,
    ) : void {
      instance._updating = true;
      update(instance, updatePayload);
      // update event handler pointers
      instance.props = newProps;
      instance._updating = false;
      instance.screen.debouncedRender();
    },

    commitTextUpdate(
      textInstance : TextInstance,
      oldText : string,
      newText : string
    ) : void {
      textInstance.setContent(newText);
      textInstance.screen.debouncedRender();
    },

    appendChild(
      parentInstance : Instance | Container,
      child : Instance | TextInstance
    ) : void {
      parentInstance.append(child);
    },

    appendChildToContainer(
      parentInstance : Instance | Container,
      child : Instance | TextInstance
    ) : void {
      parentInstance.append(child);
    },

    insertBefore(
      parentInstance : Instance | Container,
      child : Instance | TextInstance,
      beforeChild : Instance | TextInstance
    ) : void {
      // pretty sure everything is absolutely positioned so insertBefore ~= append
      parentInstance.append(child);
    },

    insertInContainerBefore(
      parentInstance : Instance | Container,
      child : Instance | TextInstance,
      beforeChild : Instance | TextInstance
    ) : void {
      // pretty sure everything is absolutely positioned so insertBefore ~= append
      parentInstance.append(child);
    },

    removeChild(
      parentInstance : Instance | Container,
      child : Instance | TextInstance
    ) : void {
      parentInstance.remove(child);
      child.destroy();
    },

    removeChildFromContainer(
      parentInstance : Instance | Container,
      child : Instance | TextInstance
    ) : void {
      parentInstance.remove(child);
      child.destroy();
    },

    resetTextContent(instance : Instance) : void {
      instance.setContent('');
    },

    schedulePassiveEffects(effect) {
      effect();

      runningEffects.push(effect);
    },

    cancelPassiveEffects() {
      runningEffects.forEach(effect => effect.cancel());

      runningEffects = [];
    }
  });

  BlessedReconciler.injectIntoDevTools(injectIntoDevToolsConfig);

  const roots = new Map();

  return function render(element, screen, callback) {
    let root = roots.get(screen);
    if (!root) {
      root = BlessedReconciler.createContainer(screen);
      roots.set(screen, root);
    }

    // render at most every 16ms. Should sync this with the screen refresh rate
    // probably if possible
    screen.debouncedRender = debounce(() => screen.render(), 16);
    BlessedReconciler.updateContainer((element : any), root, null, callback);
    screen.debouncedRender();
    return BlessedReconciler.getPublicRootInstance(root);
  }
}

export function render(element, screen, callback) {
  const blessed = require('blessed');
  const renderer = createBlessedRenderer(blessed);
  return renderer(element, screen, callback);
}
