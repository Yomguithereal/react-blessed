import React, {Component} from 'react';
import blessed from 'blessed';
import {render} from '../src';

class RemovesChild extends Component {
  constructor(props) {
    super(props);

    this.state = {renderChild: true};

    setInterval(() => {
      this.setState(state => ({renderChild: !state.renderChild}));
    }, props.freq || 500);
  }
  render() {
    const {renderChild} = this.state;

    return (
      <box
        top="center"
        left="10%"
        top="10%"
        width="80%"
        height="80%"
        border={{type: 'line'}}
        style={{bg: 'cyan', border: {fg: 'blue'}}}>
        {renderChild && (
          <box
            top="center"
            left="0"
            width="10%"
            height="20%"
            border={{type: 'line'}}
            style={{bg: 'cyan', border: {fg: 'blue'}}}>
            I will be removed
          </box>
        )}
      </box>
    );
  }
}

const screen = blessed.screen({
  autoPadding: true,
  smartCSR: true,
  title: 'react-blessed box animation'
});

screen.key(['escape', 'q', 'C-c'], function (ch, key) {
  return process.exit(0);
});

render(<RemovesChild />, screen, inst => console.log('Rendered RemovesChild!'));
