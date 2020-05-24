import * as blessedLib from "blessed";
import { createReconciler } from "./reconciler";
import { OpaqueRoot } from "react-reconciler";
const pkg = require("../package.json");

export const createBlessedRenderer = function (
  blessed: typeof blessedLib,
  screen: blessedLib.Widgets.Screen
) {
  const renderer = createReconciler(blessed, screen);
  renderer.injectIntoDevTools({
    bundleType: process.env.NODE_ENV === "development" ? 1 : 0,
    version: pkg.version,
    rendererPackageName: pkg.name,
    // findHostInstanceByFiber: renderer.findHostInstance,
  });
  const roots = new Map();
  return function render(
    element: React.ReactElement,
    screen: blessedLib.Widgets.Screen,
    callback?: (() => void) | null
  ) {
    // screenRef = screen;

    let root: OpaqueRoot | undefined = roots.get(screen);
    if (!root) {
      root = renderer.createContainer(screen as any, true, false);
      roots.set(screen, root);
    }

    // render at most every 16ms. Should sync this with the screen refresh rate
    // probably if possible
    // screen.debouncedRender = debounce(() => screen.render(), 16);
    renderer.updateContainer(element, root, null, callback as any);
    // screen.debouncedRender();
    setImmediate(() => screen.render());
    return renderer.getPublicRootInstance(root);
  };
};

export const render = function render(
  element: React.ReactElement,
  screen: blessedLib.Widgets.Screen,
  callback?: null | (() => void)
) {
  const blessed = require("blessed");
  const renderer = createBlessedRenderer(blessed, screen);
  return renderer(element, screen, callback);
};
