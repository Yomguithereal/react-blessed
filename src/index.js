if (process.env.BLESSED_RENDERER === 'stack') {
  module.exports = require('./stack');
} else {
  module.exports = require('./fiber');
}

