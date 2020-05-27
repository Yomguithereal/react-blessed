import * as blessedLib from "blessed";
import { createReconciler } from "./reconciler";
import { OpaqueRoot } from "react-reconciler";
const pkg = require("../package.json");

export const createBlessedRenderer = function (
  blessed: typeof blessedLib,
  screen: blessedLib.Widgets.Screen
) {
  const reconciler = createReconciler(blessed, screen);
  reconciler.injectIntoDevTools({
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
      root = reconciler.createContainer(screen as any, true, false);
      roots.set(screen, root);
    }
    reconciler.updateContainer(element, root, null, callback as any);
    setImmediate(() => screen.render());
    return reconciler.getPublicRootInstance(root);
  };
};

export const render = async function render(
  element: React.ReactElement,
  screen: blessedLib.Widgets.Screen,
  callback?: null | (() => void)
) {
  const blessed = require("blessed");
  const renderer = createBlessedRenderer(blessed, screen);
  return new Promise((res) =>
    renderer(element, screen, () => {
      typeof callback === "function" ? callback() : res();
    })
  );
};
