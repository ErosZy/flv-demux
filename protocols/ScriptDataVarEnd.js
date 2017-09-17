module.exports = class ScriptDataVarEnd {
  static get MIN_LENGTH() {
    return 3;
  }

  static get TYPE() {
    return 9;
  }

  constructor() {
    this.ended = false;
  }

  decode(buffer, size = 0) {
    let mark = buffer.readUInt24BE(0);
    if (mark != ScriptDataVarEnd.TYPE) {
      throw new Error(`wrong script data object end mark(${mark})`);
    }

    this.ended = true;
    return buffer.slice(3);
  }

  toJSON() {
    return {
      type: ScriptDataVarEnd.TYPE,
      ended: this.ended
    };
  }
};
