# react-blessed

A [React](https://facebook.github.io/react/) custom renderer for the [blessed](https://github.com/chjj/blessed) library.

This is only an experimental proof of concept for the time being.

## Demo

```
git clone git@github.com:Yomguithereal/react-blessed.git
cd react-blessed
npm install
npm run demo
```

## Requirements & explanation

Currently works only with `react@0.14.0-beta1`.

The demo code looks like this:

```jsx
import React, {Component} from 'react';
import {render} from 'react-blessed';

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
           style={{border: {fg: 'green'}}} />
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
```
