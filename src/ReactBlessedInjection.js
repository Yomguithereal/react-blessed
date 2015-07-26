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
import EventEmitter from 'blessed/lib/events';

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

  // NOTE: very dirty trick due to react@0.14-beta1's current state
  ReactComponentEnvironment.processChildrenUpdates = Function.prototype;

  /**
   * Overriding blessed event emitter.
   */
  const originalEmit = EventEmitter.prototype.emit;

  EventEmitter.prototype.onAny = function(fn) {
    this._any = fn;
    return this;
  };

  EventEmitter.prototype.emit = function(...args) {
    if (typeof this._any === 'function')
      this._any.apply(this, args);
    return originalEmit.apply(this, args);
  };

  EventEmitter.prototype.offAny = function() {
    EventEmitter.prototype.emit = originalEmit;
    delete this._any;
    return this;
  };
}
