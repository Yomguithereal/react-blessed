import merge from "lodash/merge";
import * as blessed from "blessed";
import { Instance } from "./types";

const RAW_ATTRIBUTES = new Set([
  // Alignment, Orientation & Presentation
  "align",
  "valign",
  "orientation",
  "shrink",
  "padding",
  "tags",
  "shadow",

  // Font-related
  "font",
  "fontBold",
  "fch",
  "ch",
  "bold",
  "underline",

  // Flags
  "clickable",
  "input",
  "keyable",
  "hidden",
  "visible",
  "scrollable",
  "draggable",
  "interactive",

  // Position
  "left",
  "right",
  "top",
  "bottom",
  "aleft",
  "aright",
  "atop",
  "abottom",

  // Size
  "width",
  "height",

  // Checkbox
  "checked",

  // Misc
  "name",
]);

export default function update(instance: Instance, options: any) {
  const { element: node } = instance;
  // TODO: enforce some kind of shallow equality?
  // TODO: handle position

  const selectQueue = [];

  for (let key in options) {
    let value = options[key];
    if (key === "selected" && "select" in node)
      selectQueue.push({
        node,
        value: typeof value === "string" ? +value : value,
      });
    // Setting label
    else if (key === "label") node.setLabel(value);
    // Removing hoverText
    else if (key === "hoverText" && !value) node.removeHover();
    // Setting hoverText
    else if (key === "hoverText" && value) node.setHover(value);
    // Setting content
    else if (key === "content") node.setContent(value);
    // Updating style
    else if (key === "style") node.style = merge({}, node.style, value);
    // Updating items
    else if (key === "items") {
      (node as blessed.Widgets.ListElement).setItems(value);
    }
    // Border edge case
    else if (key === "border") node.border = merge({}, node.border, value);
    // Textarea value
    else if (key === "value" && "setValue" in node)
      (node as blessed.Widgets.TextareaElement).setValue(value);
    // Progress bar
    else if (key === "filled") {
      const progressNode = node as blessed.Widgets.ProgressBarElement;
      // @todo update blessed types
      if ((progressNode as any).filled !== value) {
        progressNode.setProgress(value);
      }
    }
    // Table / ListTable rows / data
    else if ((key === "rows" || key === "data") && "setData" in node)
      (node as blessed.Widgets.TableElement).setData(value);
    // @todo !node[key] -- valid?
    else if (key === "focused" && value && !(node as any)[key]) node.focus();
    // Raw attributes
    else if (RAW_ATTRIBUTES.has(key)) (node as any)[key] = value;
    else {
      if (typeof value !== "function") {
        // @todo use `debug`
        // console.warn(`unknown k/v pair for node ${key} / ${value}`)
      }
    }
  }
  selectQueue.forEach(({ node, value }) => {
    (node as blessed.Widgets.ListElement).select(value);
  });
}
