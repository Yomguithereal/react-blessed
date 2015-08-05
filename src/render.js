/**
 * React Blessed
 * ==============
 *
 * Exposing the renderer's API.
 */
import ReactInstanceHandles from 'react/lib/ReactInstanceHandles';
import ReactElement from 'react/lib/ReactElement';
import ReactUpdates from 'react/lib/ReactUpdates';
import ReactBlessedIDOperations from './ReactBlessedIDOperations';
import invariant from 'invariant';
import instantiateReactComponent from 'react/lib/instantiateReactComponent';
import inject from './ReactBlessedInjection';
import blessed from 'blessed';

/**
 * Injecting dependencies.
 */
inject();

/**
 * Renders the given react element with blessed.
 *
 * @param  {ReactElement}  element   - Node to update.
 * @param  {object}        [opts={}] - Options to give to the blessed screen.
 * @return {BlessedScreen}           - The created blessed screen.
 */
function render(element, opts={}) {

  // Is the given element valid?
  invariant(
    ReactElement.isValidElement(element),
    'render(): You must pass a valid ReactElement.'
  );

  // Creating a root id & creating the screen
  const id = ReactInstanceHandles.createReactRootID(),
        screen = blessed.screen(opts);

  // Mounting the app
  const transaction = ReactUpdates.ReactReconcileTransaction.getPooled(),
        component = instantiateReactComponent(element);

  // Injecting the screen
  ReactBlessedIDOperations.setScreen(screen);

  transaction.perform(() => {
    component.mountComponent(id, transaction, {});
  });

  // Returning the screen so the user can attach listeners etc.
  return screen;
}

export {render};
