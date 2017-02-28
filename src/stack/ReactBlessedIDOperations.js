/**
 * React Blessed ID Operations
 * ============================
 *
 * Cache register for blessed nodes stored by ID.
 */
import {debounce} from 'lodash';

/**
 * The blessed nodes internal index;
 */
const blessedNodes = {};

/**
 * Backend for blessed ID operations.
 *
 * @constructor ReactBlessedIDOperations
 */
class ReactBlessedIDOperations {
  constructor() {
    this.screen = null;
  }

  /**
   * Set the current screen.
   *
   * @param  {BlessedScreen} screen     - The screen to attach.
   * @return {ReactBlessedIDOperations} - Returns itself.
   */
  setScreen(screen) {
    this.screen = screen;

    // Creating a debounced version of the render method so we won't render
    // multiple time per frame, in vain.
    screen.debouncedRender = debounce(() => screen.render(), 0);

    return this;
  }

  /**
   * Add a new node to the index.
   *
   * @param  {string}      ID           - The node's id.
   * @param  {BlessedNode} node         - The node itself.
   * @return {ReactBlessedIDOperations} - Returns itself.
   */
  add(ID, node) {
    blessedNodes[ID] = node;
    return this;
  }

  /**
   * Get a node from the index.
   *
   * @param  {string}      ID - The node's id.
   * @return {BlessedNode}    - The node.
   */
  get(ID) {
    return blessedNodes[ID];
  }

  /**
   * Get the parent of a node from the index.
   *
   * @param  {string}                    ID - The node's id.
   * @return {BlessedScreen|BlessedNode}    - The node.
   */
  getParent(ID) {

    // If the node is root, we return the screen itself
    if (ID.match(/\./g).length === 1)
      return this.screen;

    const parentID = ID.split('.').slice(0, -1).join('.');
    return this.get(parentID);
  }

  /**
   * Drop a node from the index.
   *
   * @param  {string}                   ID - The node's id.
   * @return {ReactBlessedIDOperations}    - Returns itself.
   */
  drop(ID) {
    delete blessedNodes[ID];
    return this;
  }
}

export default new ReactBlessedIDOperations();
