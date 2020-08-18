import merge from "lodash/merge";

type NonEmptyArray<T> = [T, ...T[]];

/**
 * Solves the given props by applying classes.
 *
 * @param  {object}  props - The component's props.
 * @return {object}        - The solved props.
 */
export default function solveClass<T>(props: T): T {
  let { class: classes, ...rest } = props as any;
  const args: NonEmptyArray<unknown> = [{}];
  if (classes) args.push.apply(args, [].concat(classes));
  args.push(rest);
  return merge.apply(null, args);
}
