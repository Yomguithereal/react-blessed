import React, {useState} from 'react';
import blessed from 'blessed';
import {render} from '../src';

// NOTE: hooks require react@next version, but will probly be in 16.7.0

const App = () => {
  const [demo, setDemo] = useState(0);
  return (
    <box
      label="react-blessed hooks demo"
      border={{type: 'line'}}
      style={{border: {fg: 'cyan'}}}>
      {demo}

      <button
        mouse
        border={{type: 'line'}}
        height={3}
        width={3}
        top={2}
        left={4}
        onPress={a => setDemo(demo + 1)}>
        +
      </button>
      <button
        mouse
        border={{type: 'line'}}
        height={3}
        width={3}
        top={2}
        onPress={a => setDemo(demo - 1)}>
        -
      </button>
    </box>
  );
};

const screen = blessed.screen({
  autoPadding: true,
  smartCSR: true,
  title: 'react-blessed hooks demo'
});

screen.key(['escape', 'q', 'C-c'], function (ch, key) {
  return process.exit(0);
});

render(<App />, screen);
