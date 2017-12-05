import React from 'react';
import blessed from 'blessed';
import AnimatedBox from './components/AnimatedBox';
import {render} from '../src';

const screen = blessed.screen({
  autoPadding: true,
  smartCSR: true,
  title: 'react-blessed box animation'
});

screen.key(['escape', 'q', 'C-c'], function(ch, key) {
  return process.exit(0);
});

render(<AnimatedBox />, screen, (inst) => console.log('Rendered AnimatedBox!'));
