const startCase = (string) => (
  string.replace(/(?:^\w|[A-Z]|\b\w|\s+)/g, function(match) {
    return (+match === 0) ? "" : match.toUpperCase();
  }).replace(/[^A-Za-z0-9 ]+/, "")
)

const blacklist = [
  'adopt',
  'attach',
  'destroy',
  'reparent',
  'parsed content',
  'set content',
];
const eventName = event => `on${startCase(event)}`;

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

export default eventListener;

