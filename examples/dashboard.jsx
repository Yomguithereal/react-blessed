import React, {Component} from 'react';
import blessed from 'blessed';
import {render} from '../src/render.js';

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
    return (
      <box label="Log"
           class={stylesheet.bordered}
           width="60%"
           height="70%"
           draggable={true}>
        {'Hello'}, {0}, {'World'}
      </box>
    );
  }
}

/**
 * Request component.
 */
class Request extends Component {
  render() {
    return (
      <box label="Request"
           class={stylesheet.bordered}
           top="70%"
           width="30%">
        {0}
      </box>
    );
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
    return (
      <box label="Stats"
           class={stylesheet.bordered}
           top="70%"
           left="60%"
           width="40%"
           height="31%">
        Some stats
      </box>
    );
  }
}

/**
 * Rendering the screen.
 */
const screen = blessed.screen({
  autoPadding: true,
  smartCSR: true,
  title: 'react-blessed dashboard'
});

screen.key(['escape', 'q', 'C-c'], function(ch, key) {
  return process.exit(0);
});

render(<Dashboard />, screen);
