import React, {Component} from 'react';
import blessed from 'blessed';
import {render} from '../src';

class ProgressBox extends Component {
  constructor(props) {
    super(props);

    this.state = {
      position: 0,
      toRight: true
    };

    setInterval(() => {
      const {position, toRight} = this.state,
        newDirection = position === (toRight ? 90 : 0) ? !toRight : toRight,
        newPosition = newDirection ? position + 1 : position - 1;

      this.setState({
        position: newPosition,
        toRight: newDirection
      });
    }, 30);
  }
  render() {
    const position = `${this.state.position}%`;

    return (
      <box
        top="center"
        left="0"
        width="10%"
        height="20%"
        border={{type: 'line'}}
        style={{bg: 'cyan', border: {fg: 'blue'}}}>
        <progressbar
          orientation="horizontal"
          filled={this.state.position}
          top="80%"
          left="center"
          height="15%"
          width="100%"
          label="progress"
          border={{type: 'line'}}
          style={{border: {fg: 'red'}, bar: {bg: 'red'}}}
        />
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

render(<ProgressBox />, screen, inst => console.log('Rendered ProgressBox!'));
