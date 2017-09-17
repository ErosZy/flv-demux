module.exports = class ScriptDataString {
  static get MIN_LENGTH() {
    return 2;
  }

  static get TYPE() {
    return 2;
  }

  constructor(ignoreTypeCheck = false) {
    this.ignoreTypeCheck = ignoreTypeCheck;
    this.length = 0x00;
    this.data = '';
  }

  decode(buffer, size = 0) {
    if (!this.ignoreTypeCheck) {
      let type = buffer.readUInt8(0);
      if (type != ScriptDataString.TYPE) {
        throw new Error(
          `not script data\'s string type(${type}!=${ScriptDataString.TYPE})`
        );
      }
    }

    let offset = this.ignoreTypeCheck ? 0 : 1;
    this.length = buffer.readUInt16BE(offset);
    this.data = buffer
      .slice(2 + offset, this.length + 2 + offset)
      .toString('utf-8');

    return buffer.slice(this.length + 2 + offset);
  }

  toJSON() {
    return {
      type: ScriptDataString.TYPE,
      length: this.length,
      data: this.data
    };
  }
};
