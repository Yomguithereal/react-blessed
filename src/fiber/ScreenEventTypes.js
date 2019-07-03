// Constants for native events emitted by screen
export const SCREEN_KEYPRESS = 'keypress';
export const SCREEN_FOCUS = 'focus';
export const SCREEN_BLUR = 'blur';

export const all = [
  SCREEN_KEYPRESS,
  SCREEN_FOCUS,
  SCREEN_BLUR
];

export function screenEventName(eventType) {
  return eventType;
};