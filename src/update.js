/**
 * React Blessed Update Schemes
 * =============================
 *
 * Applying updates to blessed nodes correctly.
 */

/**
 * Updates the given blessed node.
 *
 * @param {BlessedNode} node    - Node to update.
 * @param {object}      options - Props of the component without children.
 */
export default function update(node, options) {

  for (let key in options) {
    let value = options[key];

    // Setting label
    if (key === 'label')
      node.setLabel(value);

    // Setting content
    else if (key === 'content')
      node.setContent(value);

    // Progress bar
    else if (key === 'filled')
      node.setProgress(value);
  }
}
