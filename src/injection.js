/**
 * react-blessed Dependency Injection
 * ===================================
 *
 * Injecting the renderer's needed dependencies into React's internals.
 */
import ReactInjection from 'react/lib/ReactInjection';
import ReactBlessedReconcileTransaction from './transaction';
import ReactBlessedComponent from './component';

export default function inject() {
  ReactInjection.NativeComponent.injectGenericComponentClass(
    ReactBlessedComponent
  );

  ReactInjection.Updates.injectReconcileTransaction(
    ReactBlessedReconcileTransaction
  );
}
