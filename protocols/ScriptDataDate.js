module.exports = class ScriptDataDate {
  static get MIN_LENGTH() {
    return 10;
  }

  static get TYPE() {
    return 11;
  }

  constructor(ignoreTypeCheck = false) {
    this.ignoreTypeCheck = ignoreTypeCheck;
    this.dateTime = 0x00;
    this.localDateTimeOffset = 0x00;
  }

  decode(buffer, size = 0) {
    if (!this.ignoreTypeCheck) {
      let type = buffer.readUInt8(0);
      if (type != ScriptDataDate.TYPE) {
        throw new Error(
          `not script data\'s date type(${type}!=${ScriptDataDate.TYPE})`
        );
      }
    }

    let offset = this.ignoreTypeCheck ? 0 : 1;
    this.dateTime = buffer.readDoubleBE(offset);
    this.localDateTimeOffset = buffer.readInt16BE(8 + offset);

    return buffer.slice(ScriptDataDate.MIN_LENGTH + offset);
  }

  toJSON() {
    return {
      type: ScriptDataDate.TYPE,
      dateTime: this.dateTime,
      localDateTimeOffset: localDateTimeOffset
    };
  }
};
