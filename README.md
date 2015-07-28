# react-blessed

A [React](https://facebook.github.io/react/) custom renderer for the [blessed](https://github.com/chjj/blessed) library.

This renderer should currently be considered as experimental and subject to change since it works on a beta version of React (`0.14.0-beta1`).

![example](/example.png)

## Summary

* [Installation](#installation)
* [Demo](#demo)
* [Usage](#usage)
  * [Rendering a simple application](#rendering-a-simple-application)
  * [Text nodes](#text-nodes)
  * [Refs](#refs)
  * [Events](#events)
  * [Classes](#classes)
* [Roadmap](#roadmap)
* [Contribution](#contribution)
* [License](#license)

## Installation

You can install `react-blessed` through npm:

```bash
# Be sure to install react>=0.14.0 & blessed>=0.1.15 before
npm install react@0.14.0-beta1 blessed
npm install react-blessed
```

## Demo

For a quick demo of what you could achieve with such a renderer you can clone this repository and check some of the examples:

```
git clone git@github.com:Yomguithereal/react-blessed.git
cd react-blessed
npm install

# Some examples (code is in `examples/`)
npm run demo
npm run dashboard
npm run animation
```

## Usage

### Rendering a simple application

```jsx
import React, {Component} from 'react';
import {render} from 'react-blessed';

// Rendering a simple centered box
class App extends Component {
  render() {
    return <box top="center"
                left="center"
                width="50%"
                height="50%"
                border={{type: 'line'}}
                style={{border: {fg: 'blue'}}}>
              Hello World!
            </box>;
  }
}

// Creating our screen
const screen = render(<App />, {
  autoPadding: true,
  smartCSR: true,
  title: 'react-blessed hello world'
});

// Adding a way to quit the program
screen.key(['escape', 'q', 'C-c'], function(ch, key) {
  return process.exit(0);
});
```

### Text nodes

### Refs

### Events

### Classes

## Roadmap

* Full support (meaning every tags and options should be handled by the renderer).
* `react-blessed-contrib` to add some sugar over the [blessed-contrib](https://github.com/yaronn/blessed-contrib) library (probably through full-fledged components).

## Contribution

Contributions are obviously welcome.

Be sure to add unit tests if relevant and pass them all before submitting your pull request.

```bash
# Installing the dev environment
git clone git@github.com:Yomguithereal/react-blessed.git
cd react-blessed
npm install

# Running the tests
npm test
```

## License

MIT
