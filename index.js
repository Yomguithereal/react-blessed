/**
 * react-blessed
 * ==============
 *
 * Exposing the renderer's API.
 */
import ReactInstanceHandles from 'react/lib/ReactInstanceHandles';
import ReactElement from 'react/lib/ReactElement';
import ReactUpdates from 'react/lib/ReactUpdates';
import invariant from 'react/lib/invariant';
import instantiateReactComponent from 'react/lib/instantiateReactComponent';
import inject from './src/injection';
import blessed from 'blessed';

// Injecting dependencies
inject();

function render(element, opts={}) {

  // Is the given element valid?
  invariant(
    ReactElement.isValidElement(element),
    'render(): You must pass a valid ReactElement.'
  );

  // Creating a root id
  const id = ReactInstanceHandles.createReactRootID();

  // Creating our screen
  const screen = blessed.screen(opts);

  // DEBUG: escaping the screen
  screen.key(['escape', 'q', 'C-c'], function(ch, key) {
    return process.exit(0);
  });

  // Mounting the app
  const transaction = ReactUpdates.ReactReconcileTransaction.getPooled(),
        component = instantiateReactComponent(element);

  transaction.perform(() => component.mountComponent(id, transaction, {}));

  return screen;
}

export {render};
