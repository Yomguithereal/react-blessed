/**
 * Copyright (c) Facebook, Inc. and its affiliates.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */

import SyntheticEvent from './SyntheticEvent';

const SyntheticUIEvent = SyntheticEvent.extend({
  view: null,
  detail: null,
});

export default SyntheticUIEvent;
