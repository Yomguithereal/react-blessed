import React, {Component} from 'react';
import blessed from 'blessed';
import {render} from '../src';
import AnimatedBox from './components/AnimatedBox';

class Form extends Component {
  constructor(props) {
    super(props);

    this.state = {
      name: '',
    };

    this.submit = data => this.setState(state => ({name: data}));
    this.cancel = _ => console.log('Form canceled');
  }
  render() {
    return (
      <form
        keys
        vi
        focused
        onSubmit={this.submit}
        onReset={this.cancel}
        left="5%"
        top="5%"
        width="90%"
        height="90%"
        border={{type: 'line'}}
        style={{bg: 'cyan', border: {fg: 'blue'}}}
      >
        <box width={6} height={3}>Name: </box>
        <textbox
          onSubmit={this.submit}
          left={6}
          height={3}
          keys
          mouse
          inputOnFocus
        />
        <box top={3} height={3}>
          {`Result: ${this.state.name}`}
        </box>
        <AnimatedBox />
      </form>
    );
  }
}

const screen = blessed.screen({
  autoPadding: true,
  // smartCSR: true,
  title: 'react-blessed form example'
});

screen.key(['escape', 'q', 'C-c'], function(ch, key) {
  return process.exit(0);
});

render(<Form />, screen, (inst) => console.log('Rendered Form!'));


