const Tag = require('./Tag');

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

  decode(buffer, size = 0) {
    for (;;) {
      let tagSize = buffer.readUInt32BE(0);
      let body = buffer.slice(4);
      if (body.length < Tag.MIN_LENGTH) {
        return false;
      }

      let tag = new Tag();
      body = tag.decode(body);
      if (!body) {
        return false;
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
