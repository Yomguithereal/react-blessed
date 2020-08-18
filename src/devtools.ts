export function connect() {
  const defineProperty = Object.defineProperty;
  defineProperty(global, "WebSocket", {
    value: require("ws"),
  });
  defineProperty(global, "window", {
    value: global,
  });
  const { connectToDevTools } = require("react-devtools-core");
  return connectToDevTools({
    isAppActive() {
      // Don't steal the DevTools from currently active app.
      return true;
    },
    host: "localhost",
    port: 8097,
    resolveRNStyle: null,
  });
}
