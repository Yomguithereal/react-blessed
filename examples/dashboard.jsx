import React, {Component} from 'react';
import {render} from '../index.js';

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
