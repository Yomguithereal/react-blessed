/**
 * React Blessed Update Schemes
 * =============================
 *
 * Applying updates to blessed nodes correctly.
 */
export default function update(node, options) {

  for (let key in options) {
    let value = options[key];

    // Setting content
    if (key === 'content')
      node.setContent(value);

    // Progress bar
    if (key === 'filled')
      node.setProgress(value);
  }
}
