// Constants for native events emitted by screen
export const SCREEN_KEYPRESS = 'keypress';

export const all = [
  SCREEN_KEYPRESS
];

export function screenEventName(eventType) {
  return eventType;
};