import React, {Component} from 'react';
import blessed from 'neo-blessed';
import {createBlessedRenderer} from '../src';

const render = createBlessedRenderer(blessed);

class App extends Component {
  render() {
    return (
      <box label="react-blessed demo"
           border={{type: 'line'}}
           style={{border: {fg: 'cyan'}}}>
        This example uses neo-blessed fork of blessed library.
      </box>
    );
  }
}

const screen = blessed.screen({
  autoPadding: true,
  smartCSR: true,
  title: 'react-blessed demo app'
});

screen.key(['escape', 'q', 'C-c'], function(ch, key) {
  return process.exit(0);
});

const component = render(<App />, screen);
