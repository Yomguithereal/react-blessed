import React, { useEffect } from "react";
import blessed, { Widgets } from "blessed";
import { render } from "../src";
import { PassThrough } from "stream";
import { createWriteStream } from "fs";

const DemoApp = (props: { screen: Widgets.Screen }) => {
  const { screen } = props;
  const onQuit = () => process.exit(0);
  useEffect(() => {
    screen.key(["q"], onQuit);
  }, []);
  return (
    <box
      label="boxed-box"
      width="100%"
      height="100%"
      border={{ type: "line" }}
      style={{ border: { fg: "blue" } }}
    >
      <box width="20%">best-box</box>
    </box>
  );
};

const pt = new PassThrough();
(pt as any).rows = 50;
(pt as any).columns = 40;
(pt as any).isTTY = true; // psych!
pt.on("data", (chunk: any) => {
  // ws.write(chunk)
  ws.write(chunk);
});
// pt.pipe(process.stdout)
const ws = createWriteStream("/tmp/whatever");
function start() {
  const screen = blessed.screen({
    smartCSR: false,
    fastCSR: false,
    useBCE: false,
    sendFocus: false,
    warnings: true,
    width: 100,
    height: 50,
    terminal: "xterm",
    cursor: {
      artificial: false,
      shape: "block",
      color: "none",
      blink: false,
    },
    output: pt, // .pipe(ws)
    // output: pt.pipe(ws)
  });
  render(<DemoApp {...{ screen }} />, screen, () => {
    // rendered 👌
  });
}

if (!module.parent) start();
