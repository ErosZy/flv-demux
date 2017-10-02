const isBrowser = require('is-in-browser').default;
if (isBrowser) {
  window.Buffer = require('buffer/').Buffer;
}

// readUInt24 pollyfill
require('./helper/bufferReadUInt24');

module.exports = window.FlvDemux = {
  Decoder: require('./decoder'),
  AudioTag: require('./protocols/AudioTag'),
  VideoTag: require('./protocols/VideoTag'),
  DataTag: require('./protocols/DataTag')
};
