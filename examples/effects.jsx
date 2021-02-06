import React, {useState, useEffect} from 'react';
import blessed from 'blessed';
import {render} from '../src';

const WillUnmount = props => {
  useEffect(() => {
    // On unmount, we set the top level count to -5
    return () => props.setCount(-5);
  }, [props.setCount]);

  return <text>I will be gone</text>;
};

const App = () => {
  const [count, setCount] = useState(0);

  useEffect(() => {
    // Setup interval on mount
    const id = setInterval(() => setCount(count => count + 1), 1000);

    // Clear the interval on unmount
    return () => clearInterval(id);
  }, []);

  useEffect(() => {
    // On mount we set the count to 4
    setCount(4);
  }, []);

  return (
    <box
      label="react-blessed effects demo"
      border={{type: 'line'}}
      style={{border: {fg: 'cyan'}}}>
      {count}
      {count > 5 && <WillUnmount setCount={setCount} />}
    </box>
  );
};

const screen = blessed.screen({
  autoPadding: true,
  smartCSR: true,
  title: 'react-blessed effects demo'
});

screen.key(['escape', 'q', 'C-c'], function (ch, key) {
  return process.exit(0);
});

render(<App />, screen);
