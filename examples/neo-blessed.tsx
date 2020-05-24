import React, { Component } from "react";
import { createBlessedRenderer } from "../src";
const blessed = require("neo-blessed");

class App extends Component {
  render() {
    return (
      <box
        label="react-blessed demo"
        border={{ type: "line" }}
        style={{ border: { fg: "cyan" } }}
      >
        This example uses neo-blessed fork of blessed library.
      </box>
    );
  }
}

const screen = blessed.screen({
  autoPadding: true,
  smartCSR: true,
  title: "react-blessed demo app",
});

screen.key(["escape", "q", "C-c"], () => process.exit(0));
const render = createBlessedRenderer(blessed, screen);
render(<App />, screen);
