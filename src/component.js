/**
 * react-blessed Component
 * ========================
 *
 * React component abstraction for the blessed library.
 */
import blessed from 'blessed';
import camelcase from 'lodash.camelcase';

/**
 * Blessed node cache.
 */
const nodeCache = {};

/**
 * React Blessed Component.
 */
export default class ReactBlessedComponent {

  /**
   * Actual constructor.
   */
  constructor(tag) {
    this._tag = tag.toLowerCase();
    this._renderedChildren = null;
    this._previousStyle = null;
    this._previousStyleCopy = null;
    this._rootNodeID = null;
    this._wrapperState = null;
    this._topLevelWrapper = null;
    this._nodeWithLegacyProperties = null;
  }

  /**
   * React constructor.
   */
  construct(element) {

    // Setting some properties
    this._screen = global.screen;
    this._currentElement = element;
  }

  /**
   * Mounting the root component.
   */
  mountComponent(rootID, transaction, context) {
    this._rootNodeID = rootID;

    // Mounting recursively
    this.mountNode(this._screen, this._currentElement);

    // Rendering the screen
    this._screen.render();
  }

  /**
   * Mounting a blessed node and its children.
   */
  mountNode(parent, element) {
    const {props, type} = element,
          {children, ...options} = props;

    const node = blessed[camelcase(type)](options);

    parent.append(node);

    // Dealing with children
    if (children)
      [].concat(children).forEach((child) => {
        this.mountNode(node, child);
      });
  }

  /**
   * Receiving a component's update.
   */
  receiveComponent(nextElement, transaction, context) {
    const {props: {children, ...options}} = nextElement;

    // for (let k in options)

    // Dealing with children
    if (children)
      [].concat(children).forEach((child) => {
        this.updateNode(child.props);
      });
  }

  /**
   * Updating a blessed node.
   */
  updateNode(props) {

  }

  /**
   * Dropping a component.
   */
  unmountComponent() {

  }
}
