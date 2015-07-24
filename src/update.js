/**
 * React Blessed Update Schemes
 * =============================
 *
 * Applying updates to blessed nodes correctly.
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
