const Tags = require('../protocols/Tags');

module.exports = class Body {
  static get MIN_LENGTH() {
    return 4;
  }

  static get STATE() {
    return 'body';
  }

  constructor() {
    this.tags = [];
  }

  decode(buffer) {
    for (;;) {
      let tagSize = buffer.readUInt32BE(0);
      buffer = buffer.slice(4);
      if (this.buffer < Tags.MIN_LENGTH) {
        break;
      }

      let tag = new Tags();
      let body = tag.decode(buffer);
      if (!body) {
        break;
      }

      this.tags.push(tag);
      buffer = body;
    }

    return buffer;
  }

  toJSON() {
    return {
      tags: this.tags
    };
  }
};
