module.exports = class DataTag {
  static get MIN_LENGTH() {
    return 0;
  }

  static get TYPE() {
    return 18;
  }

  constructor() {}

  decode(buffer, size = 0) {
    return buffer.slice(size);
  }

  toJSON() {}
};
