import React, {Component} from 'react';

class AnimatedBox extends Component {
  constructor(props) {
    super(props);

    this.state = {
      position: props.initialPosition || 0,
      toRight: true
    };

    setInterval(() => {
      const {position, toRight} = this.state,
        newDirection = position === (toRight ? 90 : 0) ? !toRight : toRight,
        newPosition = newDirection ? position + 1 : position - 1;

      this.setState({
        position: newPosition,
        toRight: newDirection
      });
    }, props.time || 33.333333);
  }
  render() {
    const position = `${this.state.position}%`;

    return (
      <box
        top="center"
        left={position}
        width={this.props.width || '10%'}
        height={this.props.height || '20%'}
        border={{type: 'line'}}
        style={{bg: 'cyan', border: {fg: 'blue'}}}
      />
    );
  }
}

module.exports = AnimatedBox;
