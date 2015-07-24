/**
 * React Blessed ID Operations
 * ============================
 *
 * Cache register for blessed element stored by ID.
 */
const blessedElements = {};

class ReactBlessedIDOperations {

  /**
   * Constructor.
   */
  constructor() {
    this.screen = null;
  }

  /**
   * Set the current screen
   */
  setScreen(screen) {
    this.screen = screen;
    return this;
  }

  /**
   * Add a new element to the index.
   */
  add(ID, element) {
    blessedElements[ID] = element;
    return this;
  }

  /**
   * Get an element from the index.
   */
  get(ID) {
    return blessedElements[ID];
  }

  /**
   * Get the parent of an element from the index.
   */
  getParent(ID) {

    // If the element is root, we return the screen itself
    if (ID.match(/\./g).length === 1)
      return this.screen;

    const parentID = ID.split('.').slice(0, -1).join('.');
    return this.get(parentID);
  }

  /**
   * Drop an element from the index.
   */
  drop(ID) {
    delete blessedElements[ID];
    return this;
  }
}

export default new ReactBlessedIDOperations();
