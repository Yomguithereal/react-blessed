import React, { Component, createContext, useContext } from 'react';
import blessed from 'blessed';
import {render} from '../src';

// this is a bit weird, since the context provider & consumer and components are all in the same file
// normally these would all be in different places, so the provider's children can grab the context from anywhere

const DemoContext = createContext()
const { Provider } = DemoContext

// app-level provider of demo context
class DemoProvider extends Component {
  constructor (props) {
    super(props)
    this.state = {
      demo: 0
    }
    this.setDemo = this.setDemo.bind(this)
  }

  setDemo (value) {
    this.setState({ ...this.state, demo: value })
  }

  render () {
    return (
      <Provider value={{ demo: this.state.demo, setDemo: this.setDemo }}>{this.props.children}</Provider>
    )
  }
}

// wrap a component with demo context consumer
const withDemo = Component => props => {
  const context = useContext(DemoContext)
  return <Component {...props} {...context} />
}

class AppInner extends Component {
  render() {
    const { demo, setDemo } = this.props
    return (
      <box label="react-blessed context demo"
           border={{type: 'line'}}
           style={{border: {fg: 'cyan'}}}>
        
        {demo}
        
        <button mouse border={{type: 'line'}} height={3} width={3} top={2} left={4} onPress={a => setDemo(demo + 1)}>+</button>
        <button mouse border={{type: 'line'}} height={3} width={3} top={2} onPress={a => setDemo(demo - 1)}>-</button>
      </box>
    );
  }
}

const App = withDemo(AppInner)

const screen = blessed.screen({
  autoPadding: true,
  smartCSR: true,
  title: 'react-blessed context demo'
});

screen.key(['escape', 'q', 'C-c'], function(ch, key) {
  return process.exit(0);
});

render(<DemoProvider><App /></DemoProvider>, screen);
