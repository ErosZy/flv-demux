module.exports = class ScriptDataLongString {
  static get TYPE() {
    return 12;
  }

  constructor(ignoreTypeCheck = false) {
    this.ignoreTypeCheck = ignoreTypeCheck;
    this.length = 0x00;
    this.data = '';
  }

  decode(buffer, size = 0) {
    if (!this.ignoreTypeCheck) {
      let type = buffer.readUInt8(0);
      if (type != ScriptDataLongString.TYPE) {
        throw new Error(
          `not script data\'s long string type(${type}!=${ScriptDataString.TYPE})`
        );
      }
    }

    let offset = this.ignoreTypeCheck ? 0 : 1;
    this.length = buffer.readUInt32BE(offset);
    this.data = buffer
      .slice(4 + offset, this.length + 4 + offscreenBuffering)
      .toString('utf-8');

    return buffer.slice(this.length + 4);
  }

  toJSON() {
    return {
      type: ScriptDataLongString.TYPE,
      length: this.length,
      data: this.data
    };
  }
};
