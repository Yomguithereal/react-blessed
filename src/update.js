/**
 * React Blessed Update Schemes
 * =============================
 *
 * Applying updates to blessed nodes correctly.
 */
import _ from 'lodash';

const RAW_ATTRIBUTES = [

  // Alignment, Orientation & Presentation
  'align',
  'valign',
  'orientation',
  'shrink',
  'padding',
  'tags',
  'shadow',

  // Font-related
  'font',
  'fontBold',
  'fch',
  'ch',
  'bold',
  'underline',

  // Flags
  'clickable',
  'input',
  'keyable',
  'focused',
  'hidden',
  'visible',
  'scrollable',
  'draggable',
  'interactive',

  // Position
  'left',
  'right',
  'top',
  'bottom',
  'aleft',
  'aright',
  'atop',
  'abottom',

  // Size
  'width',
  'height',

  // Misc
  'name',
  'hoverText'
];

/**
 * Updates the given blessed node.
 *
 * @param {BlessedNode} node    - Node to update.
 * @param {object}      options - Props of the component without children.
 */
export default function update(node, options) {

  // TODO: enforce some kind of shallow equality?
  // TODO: handle position

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

    // Updating items
    else if (key === 'items')
      node.setItems(value);

    // Border edge case
    else if (key === 'border')
      node.border = _.merge({}, node.border, value);

    // Textarea value
    else if (key === 'value' && node.setValue)
      node.setValue(value);

    // Progress bar
    else if (key === 'filled' && node.filled !== value)
      node.setProgress(value);

    // Table / ListTable rows / data
    else if ((key === 'rows' || key === 'data') && node.setData)
      node.setData(value);

    // Raw attributes
    else
      for (let i = 0, l = RAW_ATTRIBUTES.length; i < l; i++) {
        if (key === RAW_ATTRIBUTES[i]) {
          node[key] = value;
          break;
        }
      }
  }
}
