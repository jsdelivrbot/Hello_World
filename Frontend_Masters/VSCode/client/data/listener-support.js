/**
 * A class for things we can register listeners to and fire events
 * @author Mike North
 * @public
 */
export default class ListenerSupport {
  constructor() {
     /** @type {function(ArrayLike<object>)[]} */
    this._listeners = [];
  }
  
  /**
   * Register a listener
   * @param {function(ArrayLike<object>)} listener
   * @return {void}
   */
  registerListener(listener) {
    this._listeners.push(listener);
  }

  /**
   * Un-register a listener
   * @param {function(ArrayLike<object>)} listener
   * @return {void}
   */
  unregisterListener(listener) {
    let idx = this._listeners.findIndex((x) => x === listener);
    this._listeners.splice(idx, 1);
  }

  /**
   * Fire an event, synchronously invoking all listener callbacks that have been registered
   * @param {{data: ArrayLike<object>}} payload
   * @see #register 
   */
  fire(payload) {
    this._listeners.forEach((x) => x(payload.data));
  }
}

let invoice = [];
invoice.push({
  qty: 2,
  item: {
    name: 'Apple',
    price: 1.32
  }
});

invoice.push({bad: 'thing'});