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

  /**
   * React-related injection.
   */
  ReactInjection.NativeComponent.injectGenericComponentClass(
    ReactBlessedComponent
  );

  ReactInjection.NativeComponent.injectTextComponentClass(
    ReactBlessedTextComponent
  );

  ReactInjection.Updates.injectReconcileTransaction(
    ReactBlessedReconcileTransaction
  );

  // NOTE: we're monkeypatching ReactComponentEnvironment because
  // ReactInjection.Component.injectEnvironment() currently throws,
  // as it's already injected by ReactDOM for backward compat in 0.14 betas.
  // Read more: https://github.com/Yomguithereal/react-blessed/issues/5
  ReactComponentEnvironment.processChildrenUpdates = function () {};
  ReactComponentEnvironment.replaceNodeWithMarkupByID = function () {};
}
