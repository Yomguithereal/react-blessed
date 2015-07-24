/**
 * React Blessed Text Component
 * =============================
 *
 * React component abstraction for the rendered text nodes.
 */
import blessed from 'blessed';
import ReactBlessedIDOperations from './ReactBlessedIDOperations';

/**
 * Renders the given text element with blessed.
 *
 * @constructor ReactBlessedTextComponent
 */
export default class ReactBlessedTextComponent {
  constructor(props) {}

  /**
   * @param {ReactText} text
   * @internal
   */
  construct(text) {
    this._currentElement = text;
    this._rootNodeID = null;
    this._stringText = '' + text;
  }

  /**
   * Setting the content etc. of the parent node.
   *
   * @param {string} rootID - DOM ID of the root node.
   * @param {ReactBlessedReconcileTransaction} transaction
   * @param {object} context
   * @internal
   */
  mountComponent(rootID, transaction, context) {
    this._rootNodeID = rootID;

    const parent = ReactBlessedIDOperations.getParent(rootID);

    // Setting content of parent
    parent.setContent(this._stringText);
  }

  /**
   * Updates this component by updating the text content.
   *
   * @param {ReactText}                        nextText - The next text content.
   * @param {ReactBlessedReconcileTransaction} transaction
   * @internal
   */
  receiveComponent(nextText, transaction) {
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
   * Dropping the text component.
   */
  unmountComponent() {
    const parent = ReactBlessedIDOperations.getParent(this._rootNodeID);

    // Setting content of parent
    parent.setContent('');
  }
}
