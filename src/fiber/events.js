import * as ScreenEventTypes from './ScreenEventTypes';
import SyntheticKeyboardEvent from './SyntheticKeyboardEvent';

const eventSubscriptionMappings = {};
const eventDispatchConfigs = {};
const eventRegistrationNameToConfig = {}

const screenEventTransforms = {
  [ScreenEventTypes.SCREEN_KEYPRESS]: (dispatchConfig, targetInst, eventTarget, ...args) => {
    const [ch, key] = args;
    console.log(ch);
    console.log(key);

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
      key: ch
    };
    return SyntheticKeyboardEvent.getPooled(
      dispatchConfig,
      targetInst,
      eventData,
      eventTarget
    );
  }
};

// Pairs of react events and screen native events
const eventTuples = [
  ['keyPress', ScreenEventTypes.SCREEN_KEYPRESS]
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
    root.screen.on(screenEventName, dispatchScreenEvent.bind(null, root, screenEventType));
  }
}

function dispatchScreenEvent(root, screenEventType, ...args) {
  if (screenEventType != ScreenEventTypes.SCREEN_KEYPRESS) {
    return;
  }

  const dispatchConfig = eventDispatchConfigs[screenEventType];
  const targetInst = root.screen.focused;
  const eventTransform = screenEventTransforms[screenEventType];
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
    if (dispatchConfig.phasedRegistrationNames.captured in node.props) {
      captureListeners.unshift(node);
    }
    if (dispatchConfig.phasedRegistrationNames.bubbled in node.props) {
      bubbleListeners.push(node);
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
