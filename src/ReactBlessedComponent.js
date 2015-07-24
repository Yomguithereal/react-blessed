/**
 * react-blessed Component
 * ========================
 *
 * React component abstraction for the blessed library.
 */
import blessed from 'blessed';
import ReactMultiChild from 'react/lib/ReactMultiChild';
import ReactBlessedIDOperations from './ReactBlessedIDOperations';
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
  }

  /**
   * Mounting the root component.
   */
  mountComponent(rootID, transaction, context) {
    this._rootNodeID = rootID;

    // Mounting blessed node
    const node = this.mountNode(
      ReactBlessedIDOperations.getParent(rootID),
      this._currentElement
    );

    ReactBlessedIDOperations.add(rootID, node);

    // Mounting children
    const childrenToUse = [].concat(this._currentElement.props.children || []);

    this.mountChildren(
      childrenToUse,
      transaction,
      context
    );

    // Rendering the screen
    // TODO: do this only once
    ReactBlessedIDOperations.screen.render();
  }

  /**
   * Mounting a blessed node and its children.
   */
  mountNode(parent, element) {
    const {props, type} = element,
          {children, ...options} = props;

    const node = blessed[type](options);

    parent.append(node);

    return node;
  }

  /**
   * Receiving a component's update.
   */
  receiveComponent(nextElement, transaction, context) {
    const {props: {children, ...options}} = nextElement,
          node = ReactBlessedIDOperations.get(this._rootNodeID);

    for (let key in options) {
      let value = options[key];

      if (key === 'content')
        node.setContent(value);

      if (key === 'filled')
        node.setProgress(value);
    }

    // Updating children
    const childrenToUse = [].concat(children || []);

    this.updateChildren(childrenToUse, transaction, context);

    ReactBlessedIDOperations.screen.render();
  }

  /**
   * Dropping a component.
   */
  unmountComponent() {
    this.unmountChildren();

    const parent = ReactBlessedIDOperations.getParent(this._rootNodeID),
          node = ReactBlessedIDOperations.get(this._rootNodeID);

    parent.remove(node);

    ReactBlessedIDOperations.drop(this._rootNodeID);

    this._rootNodeID = null;
  }
}

assign(
  ReactBlessedComponent.prototype,
  ReactMultiChild.Mixin
);
