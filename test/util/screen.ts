import { Widgets } from "blessed";

export const asPlainChars = (lines: [number, string][][]) =>
  lines.map((chars) => chars.map(([_, char]) => char));
export const asString = (charRows: string[][]) =>
  charRows.map((row) => row.join("")).join("\n");
export const screenToString = (screen: Widgets.Screen) =>
  asString(asPlainChars((screen as any).lines));
