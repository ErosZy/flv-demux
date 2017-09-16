module.exports = class AudioTag {
  static get MIN_LENGTH() {
    return 0;
  }

  static get TYPE() {
    return 8;
  }

  constructor() {}

  decode(buffer, size = 0) {
    return buffer.slice(size);
  }

  toJSON() {}
};
