# react-blessed

A [React](https://facebook.github.io/react/) custom renderer for the [blessed](https://github.com/chjj/blessed) library.

This is only an experimental proof of concept for the time being.

## Demo

```
git clone git@github.com:Yomguithereal/react-blessed.git
cd react-blessed
npm install
npm run demo
# or
npm run dashboard
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
        Random text here...
      </box>
    );
  }
}

class InnerBox extends Component {
  constructor(props) {
    super(props);

    this.state = {
      hey: true
    };

    setInterval(() => {
      this.setState({hey: !this.state.hey});
    }, 1000);
  }

  render() {
    const position = this.props.position;

    const left = position === 'left' ? '2%' : '53%';

    return (
      <box label={this.state.hey ? 'First step' : 'Second step'}
           ref="box"
           left={left}
           width='45%'
           height="70%"
           top="10%"
           border={{type: 'line'}}
           style={{border: {fg: 'green'}}}>
        {this.state.hey ? 'Hey...' : 'Ho...'}
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
  smartCSR: true,
  title: 'react-blessed demo app'
});

screen.key(['escape', 'q', 'C-c'], function(ch, key) {
  return process.exit(0);
});
```

The dashboard's one:

```jsx
import React, {Component} from 'react';
import {render} from 'react-blessed';

/**
 * Stylesheet
 */
const stylesheet = {
  bordered: {
    border: {
      type: 'line'
    },
    style: {
      border: {
        fg: 'blue'
      }
    }
  }
};

/**
 * Top level component.
 */
class Dashboard extends Component {
  render() {
    return (
      <element>
        <Log />
        <Request />
        <Response />
        <Jobs />
        <Progress />
        <Stats />
      </element>
    );
  }
}

/**
 * Log component.
 */
class Log extends Component {
  render() {
    return <box label="Log"
                class={stylesheet.bordered}
                width="60%"
                height="70%" />;
  }
}

/**
 * Request component.
 */
class Request extends Component {
  render() {
    return <box label="Request"
                class={stylesheet.bordered}
                top="70%"
                width="30%" />;
  }
}

/**
 * Response component.
 */
class Response extends Component {
  render() {
    return <box label="Response"
                class={stylesheet.bordered}
                top="70%"
                left="30%"
                width="30%" />;
  }
}

/**
 * Jobs component.
 */
class Jobs extends Component {
  render() {
    return <box label="Jobs"
                class={stylesheet.bordered}
                left="60%"
                width="40%"
                height="60%" />;
  }
}

/**
 * Progress component.
 */
class Progress extends Component {
  constructor(props) {
    super(props);

    this.state = {progress: 0, color: 'blue'};

    const interval = setInterval(() => {
      if (this.state.progress >= 100)
        return clearInterval(interval);

      this.setState({progress: this.state.progress + 1});
    }, 50);
  }

  render() {
    const {progress} = this.state,
          label = `Progress - ${progress}%`;

    return <progressbar label={label}
                        onComplete={() => this.setState({color: 'green'})}
                        class={stylesheet.bordered}
                        filled={progress}
                        top="60%"
                        left="60%"
                        width="40%"
                        height="10%"
                        style={{bar: {bg: this.state.color}}} />;
  }
}

/**
 * Stats component.
 */
class Stats extends Component {
  render() {
    return <box label="Stats"
                class={stylesheet.bordered}
                top="70%"
                left="60%"
                width="40%"
                height="31%" />;
  }
}

/**
 * Rendering the screen.
 */
const screen = render(<Dashboard />, {
  autoPadding: true,
  smartCSR: true,
  title: 'react-blessed dashboard'
});

screen.key(['escape', 'q', 'C-c'], function(ch, key) {
  return process.exit(0);
});
```

## Roadmap

* **Done**: text nodes
* **Done**: refs
* **Done**: events
* **Nearly done**: kind of classes à la `react-native` (lack some polymorphisms)
* full support (handling every tags of the `blessed` library and updates)
* [blessed-contrib](https://github.com/yaronn/blessed-contrib) support (probably through full-fledged components and not through basic tags).
* Distribution and release

## License

MIT
