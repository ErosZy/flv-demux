const isBrowser = require('is-in-browser').default;
if (isBrowser) {
  window.Buffer = require('buffer/').Buffer;
}

// readUInt24 pollyfill
require('./helper/bufferReadUInt24');

const FLVDemux = {
  Decoder: require('./decoder'),
  AudioTag: require('./protocols/AudioTag'),
  VideoTag: require('./protocols/VideoTag'),
  DataTag: require('./protocols/DataTag')
};

module.exports = FLVDemux;
