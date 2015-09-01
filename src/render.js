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
import {Screen} from 'blessed';

/**
 * Injecting dependencies.
 */
inject();

/**
 * Renders the given react element with blessed.
 *
 * @param  {ReactElement}   element   - Node to update.
 * @param  {BlessedScreen}  screen    - The screen used to render the app.
 * @return {ReactComponent}           - The rendered component instance.
 */
function render(element, screen) {

  // Is the given element valid?
  invariant(
    ReactElement.isValidElement(element),
    'render(): You must pass a valid ReactElement.'
  );

  // Is the given screen valid?
  invariant(
    screen instanceof Screen,
    'render(): You must pass a valid BlessedScreen.'
  );

  // Creating a root id & creating the screen
  const id = ReactInstanceHandles.createReactRootID();

  // Mounting the app
  const transaction = ReactUpdates.ReactReconcileTransaction.getPooled(),
        component = instantiateReactComponent(element);

  // Injecting the screen
  ReactBlessedIDOperations.setScreen(screen);

  transaction.perform(() => {
    component.mountComponent(id, transaction, {});
  });

  // Returning the screen so the user can attach listeners etc.
  return component._instance;
}

export {render};
