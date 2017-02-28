/**
 * React Blessed Classes Solving
 * ==============================
 *
 * Solving a component's classes to apply correct props to an element.
 */
import {merge, compact} from 'lodash';

/**
 * Solves the given props by applying classes.
 *
 * @param  {object}  props - The component's props.
 * @return {object}        - The solved props.
 */
export default function solveClass(props) {
  let {class: classes, ...rest} = props;

  // Coercing to array & compacting
  classes = compact([].concat(classes));

  return merge.apply(null, [{}].concat(classes).concat(rest));
}
