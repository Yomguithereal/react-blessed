/**
 * React Blessed Classes Solving
 * ==============================
 *
 * Solving a component's classes to apply correct props to an element.
 */
import merge from 'lodash/merge';
const emptyArray = [];

/**
 * Solves the given props by applying classes.
 *
 * @param  {object}  props - The component's props.
 * @return {object}        - The solved props.
 */
export default function solveClass(props) {
  let {class: classes, ...rest} = props;

  const args = [{}];

  if (classes) args.push.apply(args, emptyArray.concat(classes));

  args.push(rest);

  return merge.apply(null, args);
}
