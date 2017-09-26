const EventEmitter = require('events').EventEmitter;
const Tag = require('./Tag');

module.exports = class Body extends EventEmitter {
  static get MIN_LENGTH() {
    return 4;
  }

  static get STATE() {
    return 'body';
  }

  decode(buffer, size = 0) {
    const flvBody = buffer;
    
    for (;;) {
      if (buffer.length < Body.MIN_LENGTH) {
        return buffer.byteLength === flvBody.byteLength ? false : buffer;
      }

      let tagSize = buffer.readUInt32BE(0);
      let body = buffer.slice(4);
      if (body.length < Tag.MIN_LENGTH) {
        return buffer.byteLength === flvBody.byteLength ? false : buffer;
      }

      let tag = new Tag();
      body = tag.decode(body);
      if (!body) {
        return buffer.byteLength === flvBody.byteLength ? false : buffer;
      }

      this.emit('tag', tag.toJSON());
      buffer = body;
    }

    return buffer;
  }
};
