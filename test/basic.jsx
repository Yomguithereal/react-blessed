import React, {Component} from 'react';
import {render} from '../index.js';

class App extends Component {
  render() {
    return (
      <box top="center"
           left="center"
           width="50%"
           height="50%"
           border={{type: 'line'}}
           style={{border: {fg: 'magenta'}}}>
        <box content="shawarma"
             top="center"
             width="40%"
             height="50%"
             border={{type: 'line'}} />
        <box content="falafel"
             top="center"
             left="50%"
             width="40%"
             height="50%"
             border={{type: 'line'}} />
      </box>
    );
  }
}

const screen = render(<App />, {
  autoPadding: true,
  smartCSR: true
});
