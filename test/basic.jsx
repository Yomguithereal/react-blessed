import React from 'react';
import {render} from '../index.js';

const screen = render(<div />, {
  autoPadding: true,
  smartCSR: true
});

