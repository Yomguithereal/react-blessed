
const {startCase} = require('lodash');

const blacklist = [
  'adopt',
  'attach',
  'destroy',
  'reparent',
  'parsed content',
  'set content',
];
const eventName = event => `on${startCase(event).replace(/ /g, '')}`;

const eventListener = (node, event, ...args) => {
  if (node._updating) return;

  const handler = node.props[eventName(event)];

  /*
  if (blacklist.indexOf(event) === -1) {
    if (handler) {
      console.log(event, ': ', startCase(event).replace(/ /g, ''));
    }
  }
  */

  if (typeof handler === 'function') {
    if (event === 'focus' || event === 'blur') {
      args[0] = node;
    }
    handler(...args);
  }
};

module.exports = eventListener;

