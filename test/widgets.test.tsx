import ava, { TestInterface } from "ava";
import React from "react";
import { render } from "../src";
import { getScreen } from "./fixtures/screen";
import { screenToString } from "./util/screen";

const test = ava as TestInterface<{}>;

test("<box />", async (t) => {
  const screen = getScreen();
  await render(
    <box
      label="root-box"
      width="100%"
      height="100%"
      border={{ type: "line" }}
      style={{ border: { fg: "blue" } }}
    >
      <box
        label="child-box"
        border={{ type: "line" }}
        style={{ border: { fg: "blue" } }}>
        best-box
      </box>
    </box>,
    screen
  );
  await new Promise((res) => setTimeout(res, 0));
  t.snapshot(screenToString(screen));
});
