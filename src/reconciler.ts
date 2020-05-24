import * as blessedLib from "blessed";
import startCase from "lodash/startCase";
import createFiberReconciler, { OpaqueHandle } from "react-reconciler";
import solveClass from "./solveClass";
import {
  ChildSet,
  Container,
  HostContext,
  HydratableInstance,
  Instance,
  NoTimeout,
  Props,
  PublicInstance,
  TextInstance,
  TimeoutHandle,
  Type,
  UpdatePayload,
} from "./types";
import update from "./update";

const emptyObject = {};

/**
 * createInstance as common entrypoint for handler.createInstance and
 * handler.createTextInstance
 */
const createInstance = (
  type: Type,
  props: Props,
  rootContainerInstance: Container,
  hostContext: HostContext,
  internalInstanceHandle: OpaqueHandle,
  blessed: typeof blessedLib
): Instance => {
  const { children, ...appliedProps } = solveClass(props);
  const element = ((blessed as any)[type] as any)(
    appliedProps as any
  ) as blessedLib.Widgets.BlessedElement;
  const instance: Instance = {
    isUpdating: false,
    type,
    props,
    element: element,
    eventListener: null as any,
  };
  instance.eventListener = (channel: any, evt: string) =>
    eventListener(instance, channel, evt);
  element.on("event" as any, instance.eventListener);
  return instance;
};

export const createReconciler = (blessed: typeof blessedLib, screen: blessedLib.Widgets.Screen) =>
  createFiberReconciler<
    Type,
    Props,
    Container,
    Instance,
    TextInstance,
    HydratableInstance,
    PublicInstance,
    HostContext,
    UpdatePayload,
    ChildSet,
    TimeoutHandle,
    NoTimeout
  >({
    supportsHydration: false,
    isPrimaryRenderer: true,
    cancelDeferredCallback: () => {},
    supportsMutation: true,
    supportsPersistence: false,
    getRootHostContext: (_rootContainerInstance) => emptyObject,
    getChildHostContext(
      parentHostContext: HostContext,
      type: string
    ): HostContext {
      return emptyObject;
    },
    getPublicInstance(instance) {
      if (instance instanceof blessed.Widgets.TextElement) {
        // @todo maybe just cast i dont know. strings may be ok
        throw new Error("no strings allow, bro");
      }
      return instance as Instance;
    },

    createInstance(
      type,
      props,
      rootContainerInstance,
      hostContext,
      internalInstanceHandle
    ) {
      return createInstance(
        type,
        props,
        rootContainerInstance,
        hostContext,
        internalInstanceHandle,
        blessed
      );
    },

    appendInitialChild(parentInstance, child: Instance): void {
      parentInstance.element.append(child.element);
    },

    finalizeInitialChildren(
      instance: Instance,
      type: string,
      props: Props,
      rootContainerInstance: Container
    ): boolean {
      const { children, ...appliedProps } = solveClass(props);
      update(instance, appliedProps);
      instance.props = props;
      return false;
    },

    prepareUpdate(
      instance,
      type,
      oldProps,
      newProps,
      rootContainerInstance,
      hostContext
    ) {
      return solveClass(newProps);
    },

    shouldSetTextContent(props) {
      return false;
    },

    shouldDeprioritizeSubtree(type, props) {
      return !!props.hidden;
    },

    now: Date.now,

    createTextInstance(
      text,
      rootContainerInstance,
      hostContext,
      internalInstanceHandle
    ) {
      const instance = createInstance(
        "text",
        {},
        rootContainerInstance,
        hostContext,
        internalInstanceHandle,
        blessed
      );
      instance.element.setContent(text);
      return instance;
    },

    scheduleDeferredCallback(a) {
      throw new Error("Unimplemented");
    },

    prepareForCommit() {
      // noop
    },

    resetAfterCommit() {
      // noop
    },

    commitMount(
      instance: Instance,
      type: string,
      newProps: Props,
      internalInstanceHandle: Object
    ) {
      throw new Error(
        "commitMount not implemented. Please post a reproducible use case that calls this method at https://github.com/Yomguithereal/react-blessed/issues/new"
      );
    },

    commitUpdate(
      instance,
      updatePayload,
      type,
      oldProps,
      newProps,
      internalInstanceHandle
    ) {
      instance.isUpdating = true;
      update(instance, updatePayload);
      // update event handler pointers
      instance.props = newProps;
      instance.isUpdating = false;
      screen.render();
    },

    commitTextUpdate(
      textInstance: TextInstance,
      oldText: string,
      newText: string
    ): void {
      textInstance.element.setContent(newText);
      screen.render();
    },

    appendChild(parentInstance, child): void {
      parentInstance.element.append(child.element);
    },

    appendChildToContainer(parentInstance, child: Instance): void {
      // parentInstance.append(child);
      // @todo uhhh this was a guess, the last impl just did ^
      // parentInstance.element.append(child as any);
      screen.append(child.element);
    },

    insertBefore(parentInstance, child: Instance, beforeChild) {
      // pretty sure everything is absolutely positioned so insertBefore ~= append
      parentInstance.element.append(child.element);
    },

    insertInContainerBefore(
      parentInstance,
      child: Instance,
      beforeChild
    ): void {
      // pretty sure everything is absolutely positioned so insertBefore ~= append
      // parentInstance.append(child as any);
      screen.append(child.element);
    },

    removeChild(parentInstance: Instance, child: Instance): void {
      parentInstance.element.remove(child.element);
      child.element.off("event", child.eventListener);
      child.element.forDescendants(function (el) {
        el.off("event", child.eventListener);
      }, null);
      child.element.destroy();
    },

    removeChildFromContainer(parentInstance: Container, child: Instance): void {
      parentInstance.remove(child.element);
      child.element.off("event", child.eventListener);
      child.element.forDescendants(function (el) {
        el.off("event", child.eventListener);
      }, null);
      child.element.destroy();
    },

    resetTextContent(instance: Instance): void {
      instance.element.setContent("");
    },

    // schedulePassiveEffects(effect) {
    //   effect();
    //   runningEffects.push(effect);
    // },

    // cancelPassiveEffects() {
    //   runningEffects.forEach((effect) => effect.cancel());
    //   runningEffects = [];
    // },
    setTimeout,
    clearTimeout,
    noTimeout: null,
  });

const eventName = (event: string) => `on${startCase(event)}`;

/**
 * Pipe handlers, a la `<box onClick={...} />`
 * from the event emitters into user declared props callbacks
 */
export const eventListener = (
  node: Instance,
  event: string,
  ...args: any[]
) => {
  if (node.isUpdating) return;
  const handler = node.props[eventName(event)];
  if (typeof handler === "function") {
    if (event === "focus" || event === "blur") {
      args[0] = node;
    }
    handler(node.element, event, ...args);
  }
};
