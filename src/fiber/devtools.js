/* global __REACT_DEVTOOLS_GLOBAL_HOOK__ */

module.exports = {
  version: require('react').version
};

try {
  require.resolve('react-devtools-core');
  const defineProperty = Object.defineProperty;
  defineProperty(global, 'WebSocket', {
    value: require('ws')
  });
  defineProperty(global, 'window', {
    value: global
  });
  const {connectToDevTools} = require('react-devtools-core');

  connectToDevTools({
    isAppActive() {
      // Don't steal the DevTools from currently active app.
      return true;
    },
    host: 'localhost',
    port: 8097,
    resolveRNStyle: null // TODO maybe: require('flattenStyle')
  });
} catch (err) {
  // no devtools installed...
}
