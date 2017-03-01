/**
 * React Blessed Classes Solving
 * ==============================
 *
 * Solving a component's classes to apply correct props to an element.
 */
import {merge, compact} from 'lodash';
const emptyArray = [];

/**
 * Solves the given props by applying classes.
 *
 * @param  {object}  props - The component's props.
 * @return {object}        - The solved props.
 */
export default function solveClass(props) {
  let {class: classes, ...rest} = props;

  return merge(
    {},
    // Coercing to array & compacting, but only if there is work to do
    classes ? compact(emptyArray.concat(classes)) : null,
    rest
  );
}
