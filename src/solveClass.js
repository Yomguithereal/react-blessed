/**
 * React Blessed Classes Solving
 * ==============================
 *
 * Solving a component's classes to apply correct props to an element.
 */

// TODO: fallback to lodash.merge
import {merge} from 'lodash';

/**
 * Solves the given props by applying classes.
 *
 * @param  {object}  props - The component's props.
 * @return {object}        - The solved props.
 */
export default function solveClass(props) {
  const {class: classes, ...rest} = props;
  return merge({}, classes, rest);
}
