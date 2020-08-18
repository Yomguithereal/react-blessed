import * as blessed from "blessed";
import { createTty } from "./tty";

export const getScreen = () =>
  blessed.screen({
    cursor: { artificial: false, blink: false, color: "none", shape: "block" },
    fastCSR: false,
    sendFocus: false,
    smartCSR: false,
    terminal: "xterm",
    useBCE: false,
    warnings: false,
    width: 60,
    height: 30,
    output: createTty({}),
  });
