import React, {Component} from 'react';
import {render} from '../index.js';

class App extends Component {
  render() {
    return (
      <box label="react-blessed demo"
           border={{type: 'line'}}
           style={{border: {fg: 'cyan'}}}>
        <InnerBox position="left" />
        <InnerBox position="right" />
        <ProgressBar />
      </box>
    );
  }
}

class InnerBox extends Component {
  render() {
    const position = this.props.position;

    const left = position === 'left' ? '2%' : '53%';

    return (
      <box label={position}
           left={left}
           width='45%'
           height="70%"
           top="10%"
           border={{type: 'line'}}
           style={{border: {fg: 'green'}}}>
      </box>
    );
  }
}

class ProgressBar extends Component {
  constructor(props) {
    super(props);

    this.state = {completion: 0};

    const interval = setInterval(() => {
      if (this.state.completion >= 100)
        return clearInterval(interval);

      this.setState({completion: this.state.completion + 10});
    }, 1000);
  }

  render() {
    return <progressbar orientation="horizontal"
                        filled={this.state.completion}
                        top="80%"
                        left="center"
                        height="15%"
                        width="80%"
                        label="progress"
                        border={{type: 'line'}}
                        style={{border: {fg: 'red'}, bar: {bg: 'red'}}} />
  }
}

const screen = render(<App />, {
  autoPadding: true,
  smartCSR: true
});
