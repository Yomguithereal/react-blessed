import React, {Component} from 'react';
import {render} from '../index.js';

class App extends Component {
  constructor(props, context) {
    super(props, context);

    this.state = {
      left: 'shawarma',
      display: true
    };

    setTimeout(() => this.setState({left: 'kebbe'}), 1000);
    setTimeout(() => this.setState({display: false}), 2000);
  }

  render() {
    return (
      <box ref="container"
           top="center"
           left="center"
           width="50%"
           height="50%"
           border={{type: 'line'}}
           style={{border: {fg: 'magenta'}}}>
        <box content={this.state.left}
             top="center"
             width="40%"
             height="50%"
             border={{type: 'line'}} />
        {this.state.display &&
          <box content="falafel"
               top="center"
               left="50%"
               width="40%"
               height="50%"
               border={{type: 'line'}} />}
      </box>
    );
  }
}

const screen = render(<App />, {
  autoPadding: true,
  smartCSR: true
});
