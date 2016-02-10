/**
 * React Blessed Component
 * ========================
 *
 * React component abstraction for the blessed library.
 */
import blessed from 'blessed';
import ReactMultiChild from 'react/lib/ReactMultiChild';
import ReactBlessedIDOperations from './ReactBlessedIDOperations';
import invariant from 'invariant';
import update from './update';
import solveClass from './solveClass';
import {extend, groupBy, startCase} from 'lodash';

/**
 * Variable types that must be solved as content rather than real children.
 */
const CONTENT_TYPES = {string: true, number: true};

/**
 * Renders the given react element with blessed.
 *
 * @constructor ReactBlessedComponent
 * @extends ReactMultiChild
 */
export default class ReactBlessedComponent {
  constructor(tag) {
    this._tag = tag.toLowerCase();
    this._updating = false;
    this._renderedChildren = null;
    this._previousStyle = null;
    this._previousStyleCopy = null;
    this._rootNodeID = null;
    this._wrapperState = null;
    this._topLevelWrapper = null;
    this._nodeWithLegacyProperties = null;
  }

  construct(element) {

    // Setting some properties
    this._currentElement = element;
    this._eventListener = (type, ...args) => {
      if (this._updating) return;
      
      const handler = this._currentElement.props['on' + startCase(type).replace(/ /g, '')];

      if (typeof handler === 'function') {
        if (type === 'focus' || type === 'blur') {
          args[0] = ReactBlessedIDOperations.get(this._rootNodeID)
        }
        handler(...args);
      }
    };
  }

  /**
   * Mounting the root component.
   *
   * @internal
   * @param  {string} rootID - The root blessed ID for this node.
   * @param  {ReactBlessedReconcileTransaction} transaction
   * @param  {object} context
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
    let childrenToUse = this._currentElement.props.children;
    childrenToUse = childrenToUse === null ? [] : [].concat(childrenToUse);

    if (childrenToUse.length) {

      // Discriminating content components from real children
      const {content=null, realChildren=[]} = groupBy(childrenToUse, (c) => {
        return CONTENT_TYPES[typeof c] ? 'content' : 'realChildren';
      });

      // Setting textual content
      if (content)
        node.setContent('' + content.join(''));

      // Mounting real children
      this.mountChildren(
        realChildren,
        transaction,
        context
      );
    }

    // Rendering the screen
    ReactBlessedIDOperations.screen.debouncedRender();
  }

  /**
   * Mounting the blessed node itself.
   *
   * @param   {BlessedNode|BlessedScreen} parent  - The parent node.
   * @param   {ReactElement}              element - The element to mount.
   * @return  {BlessedNode}                       - The mounted node.
   */
  mountNode(parent, element) {
    const {props, type} = element,
          {children, ...options} = props,
          blessedElement = blessed[type];

    invariant(
      !!blessedElement,
      `Invalid blessed element "${type}".`
    );

    const node = blessed[type](solveClass(options));

    node.on('event', this._eventListener);
    parent.append(node);

    return node;
  }

  /**
   * Receive a component update.
   *
   * @param {ReactElement}              nextElement
   * @param {ReactReconcileTransaction} transaction
   * @param {object}                    context
   * @internal
   * @overridable
   */
  receiveComponent(nextElement, transaction, context) {
    const {props: {children, ...options}} = nextElement,
          node = ReactBlessedIDOperations.get(this._rootNodeID);

    this._updating = true;
    update(node, solveClass(options));
    this._updating = false;

    // Updating children
    const childrenToUse = children === null ? [] : [].concat(children);

    // Discriminating content components from real children
    const {content=null, realChildren=[]} = groupBy(childrenToUse, (c) => {
      return CONTENT_TYPES[typeof c] ? 'content' : 'realChildren';
    });

    // Setting textual content
    if (content)
      node.setContent('' + content.join(''));

    this.updateChildren(realChildren, transaction, context);

    ReactBlessedIDOperations.screen.debouncedRender();
  }

  /**
   * Dropping the component.
   */
  unmountComponent() {
    this.unmountChildren();

    const node = ReactBlessedIDOperations.get(this._rootNodeID);

    node.off('event', this._eventListener);
    node.destroy();

    ReactBlessedIDOperations.drop(this._rootNodeID);

    this._rootNodeID = null;

    ReactBlessedIDOperations.screen.debouncedRender();
  }

  /**
   * Getting a public instance of the component for refs.
   *
   * @return {BlessedNode} - The instance's node.
   */
  getPublicInstance() {
    return ReactBlessedIDOperations.get(this._rootNodeID);
  }
}

/**
 * Extending the component with the MultiChild mixin.
 */
extend(
  ReactBlessedComponent.prototype,
  ReactMultiChild.Mixin
);
