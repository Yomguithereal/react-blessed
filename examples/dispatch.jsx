import React, { useReducer } from 'react';
import blessed from 'blessed';
import { render } from '../src';

const initialState = {count: 0};

function reducer(state, action) {
  switch (action.type) {
    case 'increment':
      return {count: state.count + 1};
    case 'decrement':
      return {count: state.count - 1};
    default:
      throw new Error();
  }
}

const App = () => {
  const [demo, dispatch] = useReducer(reducer, initialState);
  return (
    <box label="react-blessed hooks demo"
         border={{type: 'line'}}
         style={{border: {fg: 'cyan'}}}>
      
      {demo.count}
      
      <button mouse border={{type: 'line'}} height={3} width={3} top={2} left={4} onPress={a => dispatch({type: 'increment'})}>+</button>
      <button mouse border={{type: 'line'}} height={3} width={3} top={2} onPress={a => dispatch({type: 'decrement'})}>-</button>
    </box>
  );
}

const screen = blessed.screen({
  autoPadding: true,
  smartCSR: true,
  title: 'react-blessed hooks demo'
});

screen.key(['escape', 'q', 'C-c'], function(ch, key) {
  return process.exit(0);
});

render(<App />, screen);
