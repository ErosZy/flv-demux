module.exports = class VideoTag {
  static get MIN_LENGTH() {
    return 0;
  }

  static get TYPE() {
    return 9;
  }

  constructor() {
    this.frameType = 0x01;
    this.codecId = 0x01;
    this.data = null;
  }

  decode(buffer, size) {
    return buffer.slice(size);
  }

  toJSON() {}
};
