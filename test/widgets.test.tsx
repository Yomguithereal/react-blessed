import ava, { TestInterface } from "ava";
import React from "react";
import { getScreen } from "./fixtures/screen";
import { screenToString } from "./util/screen";
import { createTestRenderer, settle } from "./fixtures/render";
import { RootBox } from "./fixtures/components/RootBox";

const test = ava as TestInterface<{}>;

test("<box />", async (t) => {
  const screen = getScreen();
  const renderer = createTestRenderer(screen);
  renderer.render(
    <RootBox>
      <box
        label="child-box"
        border={{ type: "line" }}
        style={{ border: { fg: "blue" } }}
      >
        best-box
      </box>
    </RootBox>,
    screen
  );
  await settle();
  t.snapshot(screenToString(screen));
});

test("<list />", async (t) => {
  const screen = getScreen();
  const renderer = createTestRenderer(screen);
  renderer.render(
    <RootBox>
      <list
        label="child-list"
        border={{ type: "line" }}
        style={{ border: { fg: "blue" } }}
        items={["a", "b", "c", "1", "2", "3"]}
      ></list>
    </RootBox>,
    screen
  );
  await settle();
  t.snapshot(screenToString(screen));
});

test("<list />, long", async (t) => {
  const screen = getScreen();
  const renderer = createTestRenderer(screen);
  renderer.render(
    <RootBox>
      <list
        label="long-list"
        border={{ type: "line" }}
        style={{ border: { fg: "blue" } }}
        items={" "
          .repeat(30)
          .split("")
          .map((_, i) => `${i}`)}
      ></list>
    </RootBox>,
    screen
  );
  await settle();
  t.snapshot(screenToString(screen));
});
