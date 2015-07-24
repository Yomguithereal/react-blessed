/**
 * React Blessed Text Component
 * =============================
 *
 * React component abstraction for the rendered text nodes.
 */
import blessed from 'blessed';
import ReactBlessedIDOperations from './ReactBlessedIDOperations';

/**
 * React Blessed Text Component.
 */
export default class ReactBlessedTextComponent {

  /**
   * Actual constructor.
   */
  constructor(props) {}

  /**
   * React constructor.
   */
  construct(text) {
    this._currentElement = text;
    this._rootNodeID = null;
    this._stringText = '' + text;
  }

  /**
   * Mounting the root component.
   */
  mountComponent(rootID, transaction, context) {
    this._rootNodeID = rootID;

    const parent = ReactBlessedIDOperations.getParent(rootID);

    // Setting content of parent
    parent.setContent(this._stringText);
  }

  /**
   * Receiving a component's update.
   */
  receiveComponent(nextText, transaction, context) {
    this._currentElement = nextText;
    const nextStringText = '' + nextText;

    if (nextStringText !== this._stringText) {

      this._stringText = nextStringText;

      const parent = ReactBlessedIDOperations.getParent(this._rootNodeID);

      // Setting content of parent
      parent.setContent(this._stringText);
    }
  }

  /**
   * Dropping a component.
   */
  unmountComponent() {
    const parent = ReactBlessedIDOperations.getParent(this._rootNodeID);

    // Setting content of parent
    parent.setContent('');
  }
}
