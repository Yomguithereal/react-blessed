/**
 * react-blessed Component
 * ========================
 *
 * React component abstraction for the blessed library.
 */
import blessed from 'blessed';
import camelcase from 'lodash.camelcase';
import ReactMultiChild from 'react/lib/ReactMultiChild';
import assign from 'object-assign';

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
    this._currentElement = element;
    this._blessedNode = null;
  }

  /**
   * Retrieving the parent node.
   *
   * NOTE: dirty!
   */
  _getParentNode() {
    return this._currentElement._owner._renderedComponent._blessedNode ||
           REACT_BLESSED_SCREEN;
  }

  /**
   * Mounting the root component.
   */
  mountComponent(rootID, transaction, context) {
    this._rootNodeID = rootID;

    // Mounting blessed node
    this.mountNode(
      this._getParentNode(),
      this._currentElement
    );

    // Mounting children
    const childrenToUse = [].concat(this._currentElement.props.children || []);

    this.mountChildren(
      childrenToUse,
      transaction,
      context
    );

    // Rendering the screen
    // TODO: do this only once
    REACT_BLESSED_SCREEN.render();
  }

  /**
   * Mounting a blessed node and its children.
   */
  mountNode(parent, element) {
    const {props, type} = element,
          {children, ...options} = props;

    this._blessedNode = blessed[camelcase(type)](options);

    parent.append(this._blessedNode);
  }

  /**
   * Receiving a component's update.
   */
  receiveComponent(nextElement, transaction, context) {
    const {props: {children, ...options}} = nextElement;

    for (let key in options) {
      let value = options[key];

      if (key === 'content')
        this._blessedNode.setContent(value);
    }

    // Updating children
    const childrenToUse = [].concat(children || []);

    this.updateChildren(childrenToUse, transaction, context);

    REACT_BLESSED_SCREEN.render();
  }

  /**
   * Dropping a component.
   */
  unmountComponent() {
    this.unmountChildren();
    this._rootNodeID = null;
    this._getParentNode().remove(this._blessedNode);
  }
}

assign(
  ReactBlessedComponent.prototype,
  ReactMultiChild.Mixin
);
