/**
 * react-blessed Text Component
 * =============================
 *
 * React component abstraction for the rendered text nodes.
 */
import blessed from 'blessed';

/**
 * React Blessed Text Component.
 */
export default class ReactBlessedTextComponent {

  /**
   * Actual constructor.
   */
  constructor(props) {console.log(arguments)}

  /**
   * React constructor.
   */
  construct(text) {
    this._currentElement = text;
    this._rootNodeID = null;
    this._stringText = '' + text;
  }

  /**
   * Retrieving the parent node.
   *
   * NOTE: dirty! replace this nonsense by some kind of cache index later.
   */
  _getParentNode() {
    return this._currentElement._owner._renderedComponent._blessedNode;
  }

  /**
   * Mounting the root component.
   */
  mountComponent(rootID, transaction, context) {
    this._rootNodeID = rootID;
    console.log(rootID)
    this._getParentNode().setContent(this._stringText);
  }

  /**
   * Mounting a blessed node and its children.
   */
  mountNode(parent, element) {

  }

  /**
   * Receiving a component's update.
   */
  receiveComponent(nextElement, transaction, context) {

  }

  /**
   * Dropping a component.
   */
  unmountComponent() {

  }
}
