/**
 * React Blessed Specific React Transaction
 * =========================================
 *
 * React custom reconcile transaction injected by the renderer to enable
 * updates.
 *
 * NOTE: This looks more like a shim than the proper thing actually.
 */
import CallbackQueue from 'react/lib/CallbackQueue';
import PooledClass from 'react/lib/PooledClass';
import Transaction from 'react/lib/Transaction';
import {extend} from 'lodash';

const ON_BLESSED_READY_QUEUEING = {
  initialize: function () {
    this.reactMountReady.reset();
  },
  close: function () {
    this.reactMountReady.notifyAll();
  }
};

function ReactBlessedReconcileTransaction() {
  this.reinitializeTransaction();
  this.reactMountReady = CallbackQueue.getPooled(null);
}

const Mixin = {
  getTransactionWrappers: function() {
    return [ON_BLESSED_READY_QUEUEING];
  },
  getReactMountReady: function() {
    return this.reactMountReady;
  },
  destructor: function() {
    CallbackQueue.release(this.reactMountReady);
    this.reactMountReady = null;
  }
};

extend(
  ReactBlessedReconcileTransaction.prototype,
  Transaction.Mixin,
  Mixin
);

PooledClass.addPoolingTo(ReactBlessedReconcileTransaction);

export default ReactBlessedReconcileTransaction;
