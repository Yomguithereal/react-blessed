/**
 * React Blessed Dependency Injection
 * ===================================
 *
 * Injecting the renderer's needed dependencies into React's internals.
 */
import ReactInjection from 'react/lib/ReactInjection';
import ReactComponentEnvironment from 'react/lib/ReactComponentEnvironment';
import ReactBlessedReconcileTransaction from './ReactBlessedReconcileTransaction';
import ReactBlessedComponent from './ReactBlessedComponent';
import ReactBlessedTextComponent from './ReactBlessedTextComponent';

export default function inject() {
  ReactInjection.NativeComponent.injectGenericComponentClass(
    ReactBlessedComponent
  );

  ReactInjection.NativeComponent.injectTextComponentClass(
    ReactBlessedTextComponent
  );

  ReactInjection.Updates.injectReconcileTransaction(
    ReactBlessedReconcileTransaction
  );

  // NOTE: very dirty trick due to react@0.14-beta1's current state
  ReactComponentEnvironment.processChildrenUpdates = Function.prototype;
}
