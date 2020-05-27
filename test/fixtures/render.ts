import * as blessed from "blessed";
import { createReconciler } from "../../src/reconciler";
import { OpaqueRoot } from "react-reconciler";

export const settle = () => new Promise((res) => setTimeout(res, 5));
export const createTestRenderer = function (screen: blessed.Widgets.Screen) {
  const reconciler = createReconciler(blessed, screen);
  const roots = new Map();
  function render(
    element: React.ReactElement,
    screen: blessed.Widgets.Screen,
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
  }
  return {
    render,
    reconciler,
  };
};
