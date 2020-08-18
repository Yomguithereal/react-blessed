import React, { useEffect } from "react";
import blessed, { Widgets } from "blessed";
import { AnimatedBox } from "./components/AnimatedBox";
import { render } from "../src";

const examples = [
  {
    name: "animation",
    component: () => <AnimatedBox />,
  },
  {
    name: "junker",
    component: () => <box>hiiiii</box>,
  },
];

const listStyle = {
  selected: {
    fg: "white",
    bold: true,
    bg: "red",
    underline: true,
  },
  item: {
    fg: "blue",
    blink: true,
  },
  scrollbar: {
    bg: "blue",
  },
};

const DemoApp = (props: { screen: Widgets.Screen }) => {
  const { screen } = props;
  const [demo, setDemo] = React.useState<any>(null);
  const onQuit = () => process.exit(0);
  const onBack = () => {
    // @todo WHY is "esc" triggering closure of the other components
    if (!demo) return onQuit();
    setDemo(null);
  };
  useEffect(() => {
    screen.key(["q"], onQuit);
    screen.key(["escape", "C-c"], onBack);
    screen.key(["tab"], () => screen.focusNext());
  }, []);
  if (demo) return examples.find((ex) => ex.name === demo)?.component!()!;
  return (
    <box
      label="demo"
      width="100%"
      height="100%"
      border={{ type: "line" }}
      style={{ border: { fg: "blue" } }}
    >
      <box width="20%">
        {`
Select a demo 😎

Use the arrow keys and hit enter to select a demo.

Press Esc or q to go back a screen, or quit!`}
      </box>
      <list
        left="20%"
        width="75%"
        keys
        mouse
        items={examples.map((ex) => ex.name)}
        style={listStyle}
        onAttach={(node: any) => node.focus()}
        onSelect={(node: any) => {
          setDemo(node.value);
        }}
      />
    </box>
  );
};

function start() {
  const screen = blessed.screen({
    autoPadding: true,
    smartCSR: true,
    title: "react-blessed // examlpes",
  });
  render(<DemoApp {...{ screen }} />, screen, () => {
    // rendered 👌
  });
}

if (!module.parent) start();
