import React, { Component } from "react";
import blessed from "blessed";
import { render } from "../src";

class Form extends Component<any, any> {
  constructor(props: any) {
    super(props);
    this.state = {
      name: "",
    };
  }
  submit = (data: any) => this.setState((state: any) => ({ name: data }));
  cancel = (_: any) => console.log("Form canceled");
  render() {
    return (
      <form
        keys
        vi
        focused
        onSubmit={this.submit}
        onReset={this.cancel}
        left="5%"
        top="5%"
        width="90%"
        height="90%"
        border={{ type: "line" }}
        // @ts-ignore
        style={{ bg: "cyan", border: { fg: "blue" } }}
      >
        <box width={6} height={3}>
          Name:{" "}
        </box>
        <textbox
          onSubmit={this.submit}
          left={6}
          height={3}
          keys
          mouse
          inputOnFocus
        />
        <box top={3} height={3}>
          {`Result: ${this.state.name}`}
        </box>
      </form>
    );
  }
}

const screen = blessed.screen({
  autoPadding: true,
  // smartCSR: true,
  title: "react-blessed form example",
});

screen.key(["escape", "q", "C-c"], function (ch, key) {
  return process.exit(0);
});

render(<Form />, screen, () => console.log("Rendered Form!"));
