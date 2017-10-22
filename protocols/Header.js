const EventEmitter = require('events').EventEmitter;

module.exports = class Header extends EventEmitter {
  static get MIN_LENGTH() {
    return 9;
  }

  static get STATE() {
    return 'header';
  }

  constructor() {
    super();
    this.signature = '';
    this.version = 0x01;
    this.hasAudio = false;
    this.hasVideo = false;
    this.offset = 0x00;
  }

  decode(buffer) {
    this.signature = buffer.slice(0, 3).toString('utf-8');
    this.version = buffer.readUInt8(3);
    if (this.signature != 'FLV' || this.version != 0x01) {
      return false;
    }

    let flags = buffer.readUInt8(4);
    this.hasAudio = (flags & 4) >>> 2 == 1;
    this.hasVideo = (flags & 1) == 1;
    this.offset = buffer.readUInt32BE(5);
    if (this.offset != 9) {
      return false;
    }

    this.emit('header', {
      signature: this.signature,
      version: this.version,
      hasAudio: this.hasAudio,
      hasVideo: this.hasVideo,
      offset: this.offset,
      originBuffer: buffer.slice(0, 9)
    });

    return buffer.slice(9);
  }
};
