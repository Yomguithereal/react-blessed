import * as ScreenEventTypes from './ScreenEventTypes';
import SyntheticKeyboardEvent from './SyntheticKeyboardEvent';
import SyntheticFocusEvent from './SyntheticFocusEvent';

const eventSubscriptionMappings = {};
const eventDispatchConfigs = {};
const eventRegistrationNameToConfig = {}

const screenEventTransforms = {
  [ScreenEventTypes.SCREEN_KEYPRESS]: (dispatchConfig, targetInst, eventTarget, ...args) => {
    const [ch, key] = args;

    const eventData = {
      type: ScreenEventTypes.SCREEN_KEYPRESS,
      target: targetInst,
      bubbles: true,
      cancelable: true,

      altKey: false,
      metaKey: key.meta,
      ctrlKey: key.ctrl,
      shiftKey: key.shift,
      repeat: false,
      key: ch,
      charCode: ch.charCodeAt(0)
    };
    return SyntheticKeyboardEvent.getPooled(
      dispatchConfig,
      targetInst,
      eventData,
      eventTarget
    );
  },
  [ScreenEventTypes.SCREEN_FOCUS]: (dispatchConfig, targetInst, eventTarget, ...args) => {
    const [old] = args;
    const eventData = {
      type: ScreenEventTypes.SCREEN_FOCUS,
      target: targetInst,
      bubbles: false,
      cancelable: false,

      relatedTarget: old
    };
    return SyntheticFocusEvent.getPooled(
      dispatchConfig,
      targetInst,
      eventData,
      eventTarget
    )
  },
  [ScreenEventTypes.SCREEN_BLUR]: (dispatchConfig, targetInst, eventTarget, ...args) => {
    const [next] = args;
    const eventData = {
      type: ScreenEventTypes.SCREEN_BLUR,
      target: targetInst,
      bubbles: false,
      cancelable: false,

      relatedTarget: next
    };
    return SyntheticFocusEvent.getPooled(
      dispatchConfig,
      targetInst,
      eventData,
      eventTarget
    )
  }
};

// Pairs of react events and screen native events
const eventTuples = [
  ['keyPress', ScreenEventTypes.SCREEN_KEYPRESS],
  ['focus', ScreenEventTypes.SCREEN_FOCUS],
  ['blur', ScreenEventTypes.SCREEN_BLUR]
];

function addEventConfiguration(eventName, screenEventType) {
  const capitalizedEvent = eventName[0].toUpperCase() + eventName.slice(1);
  const onEvent = 'on' + capitalizedEvent;
  const config = {
    phasedRegistrationNames: {
      bubbled: onEvent,
      captured: onEvent + 'Capture',
    },
    screenEvents: [screenEventType]
  };
  eventSubscriptionMappings[eventName] = config.screenEvents;
  eventDispatchConfigs[screenEventType] = config;

  eventRegistrationNameToConfig[onEvent] = config;
  eventRegistrationNameToConfig[onEvent + 'Capture'] = config;
}

eventTuples.forEach(tuple => {
  const [event, screenEventType] = tuple;
  addEventConfiguration(event, screenEventType);
});

const isListening = new Set();

function ensureListeningTo(root, screenEventType) {
  const screenEventName = ScreenEventTypes.screenEventName(screenEventType);

  if (!isListening.has(screenEventType)) {
    isListening.add(screenEventType);
    root.screen.on(screenEventName, dispatchScreenEvent.bind(null, root, screenEventType, false));
    root.screen.on('element ' + screenEventName, dispatchScreenEvent.bind(null, root, screenEventType, true));
  }
}

function dispatchScreenEvent(root, screenEventType, firstArgIsTarget, ...args) {
  const dispatchConfig = eventDispatchConfigs[screenEventType];
  const targetInst = firstArgIsTarget ? args.shift() : root.screen.focused;
  const eventTransform = screenEventTransforms[screenEventType];

  if (!eventTransform) {
    throw new Error('unhandled event: ' + screenEventType);
  }
  const syntheticEvent = eventTransform(
    dispatchConfig,
    targetInst,
    targetInst,
    ...args
  );

  // Gather list of ancestors that have listeners
  const captureListeners = [];
  const bubbleListeners = [];
  var node = targetInst;
  do {
    if (node.props) {
      if (dispatchConfig.phasedRegistrationNames.captured in node.props) {
        captureListeners.unshift(node);
      }
      if (dispatchConfig.phasedRegistrationNames.bubbled in node.props) {
        bubbleListeners.push(node);
      }
    }
    node = node.parent;
  } while (node != root);

  // Capture phase
  captureListeners.forEach(element => {
    if (syntheticEvent.isPropagationStopped()) {
      return;
    }
    element.props[dispatchConfig.phasedRegistrationNames.captured].call(element, syntheticEvent);
  });

  bubbleListeners.forEach(element => {
    if (syntheticEvent.isPropagationStopped()) {
      return;
    }
    element.props[dispatchConfig.phasedRegistrationNames.bubbled].call(element, syntheticEvent);
  });
}

function updateEventRegistrations(root, instance, props) {
  // TODO(shaheen) remove current registrations not appearing in props
  for (var propKey in props) {
    const config = eventRegistrationNameToConfig[propKey];
    if (config) {
      config.screenEvents.forEach(screenEventType => {
        ensureListeningTo(root, screenEventType);
      });
    }
  }
}

export default updateEventRegistrations;
