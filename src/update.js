/**
 * React Blessed Update Schemes
 * =============================
 *
 * Applying updates to blessed nodes correctly.
 */
import _ from 'lodash';

/**
 * Updates the given blessed node.
 *
 * @param {BlessedNode} node    - Node to update.
 * @param {object}      options - Props of the component without children.
 */
export default function update(node, options) {

  // TODO: enforce some kind of shallow equality?

  for (let key in options) {
    let value = options[key];

    // Setting label
    if (key === 'label')
      node.setLabel(value);

    // Setting content
    else if (key === 'content')
      node.setContent(value);

    // Updating style
    else if (key === 'style')
      node.style = _.merge({}, node.style, value);

    // Progress bar
    else if (key === 'filled' && node.filled !== value)
      node.setProgress(value);
  }
}
