import React, {Component} from 'react';
import blessed from 'blessed';
import {render} from '../src/render.js';

class AnimatedBox extends Component {
  constructor(props) {
    super(props);

    this.state = {
      position: 0,
      toRight: true
    };

    setInterval(() => {
      const {position, toRight} = this.state,
            newDirection = (position === (toRight ? 90 : 0)) ?
              !toRight :
              toRight,
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
      <box top="center"
           left={position}
           width="10%"
           height="20%"
           border={{type: 'line'}}
           style={{bg: 'cyan', border: {fg: 'blue'}}} />
    );
  }
}

const screen = blessed.screen({
  autoPadding: true,
  smartCSR: true,
  title: 'react-blessed box animation'
});

screen.key(['escape', 'q', 'C-c'], function(ch, key) {
  return process.exit(0);
});

render(<AnimatedBox />, screen);
