import React from 'react';
import blessed from 'blessed';
import {Motion, spring} from 'react-motion';
import {interpolateColor} from './utils/colors';
import {render} from '../src';

const range = n => Array.apply(0, Array(n)).map((_, i) => i);

function reinsert(arr, from, to) {
  const _arr = arr.slice(0);
  const val = _arr[from];
  _arr.splice(from, 1);
  _arr.splice(to, 0, val);
  return _arr;
}

function clamp(n, min, max) {
  return Math.max(Math.min(n, max), min);
}

const springConfig = {stiffness: 300, damping: 50};
const itemsCount = 4;
const width = 30;
const styles = {
  item: {
    border: {fg: 'red'},
    bg: '#000000',
    align: 'center',
    valign: 'middle',
  },
};

var lastY = null;
class Demo extends React.Component {
  state = {
    topDeltaY: 0,
    mouseY: 0,
    isPressed: false,
    originalPosOfLastPressed: 0,
    order: range(itemsCount),
  };

  componentDidMount() {
    /*
    window.addEventListener('mousemove', this.handleMouseMove);
    window.addEventListener('mouseup', this.handleMouseUp);
    */
  }

  handleMouseDown = (pos, pressY, event) => {
    if (this.state.isPressed === false) {
      const {y} = event;
      this.setState({
        topDeltaY: y - pressY,
        mouseY: pressY,
        isPressed: true,
        originalPosOfLastPressed: pos,
      });
    } else {
      this.handleMouseMove({
        ...event,
        action: 'fake-mousemove',
      });
    }
  };

  handleMouseMove = (event) => {
    if (event.action !== 'fake-mousemove') {
      return;
    }

    const pageY = event.y;
    const {isPressed, topDeltaY, order, originalPosOfLastPressed} = this.state;

    if (isPressed) {
      const mouseY = pageY - topDeltaY;

      const currentRow = clamp(Math.round(mouseY / 100), 0, itemsCount - 1);
      let newOrder = order;

      if (currentRow !== order.indexOf(originalPosOfLastPressed)){
        newOrder = reinsert(order, order.indexOf(originalPosOfLastPressed), currentRow);
      }

      this.setState({mouseY: mouseY, order: newOrder});
    }
  };

  handleMouseUp = () => {
    // this.setState({isPressed: false, topDeltaY: 0});
  };

  render() {
    const {mouseY, isPressed, originalPosOfLastPressed, order} = this.state;

    return (
      <box
        style={{
          bg: '#555555',
        }}
      >
        <box
          top={0}
          right={0}
          width={10}
          height={1}
        >{order.map(i => i + 1).join(', ')}</box>

        {range(itemsCount).map(i => {
          const style = originalPosOfLastPressed === i && isPressed
            ? {
                scale: spring(1.1, springConfig),
                color: 3,
                y: mouseY,
              }
            : {
                scale: spring(1, springConfig),
                color: 0,
                y: spring(order.indexOf(i) * 5, springConfig),
              };
          return (
            <Motion style={style} key={i}>
              {({scale, shadow, y}) =>
                <box
                  onMousedown={this.handleMouseDown.bind(null, i, y)}
                  onMouse={this.handleMouseMove}
                  onMouseup={this.handleMouseUp}
                  left={width * 2 - scale * width}
                  top={y}
                  height={4}
                  width={scale * width}
                  border={{type: 'line'}}
                  shadow={shadow > 0.2}
                  style={styles.item}
                >
                  {i === 2 &&
                    <box
                      top={0}
                      right={0}
                      width={10}
                      height={1}
                    >{String(i) + ': ' + String(y)}</box>}
                  {String(order.indexOf(i) + 1)}
              </box>}
            </Motion>
          );
        })}
      </box>
    );
  }
}

const screen = blessed.screen({
  autoPadding: true,
  smartCSR: true,
  title: 'react-blessed demo app'
});

screen.key(['escape', 'q', 'C-c'], function(ch, key) {
  return process.exit(0);
});

const component = render(<Demo />, screen);
