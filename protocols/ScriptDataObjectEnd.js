module.exports = class ScriptDataObjectEnd {
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
    if (mark != ScriptDataObjectEnd.TYPE) {
     this.ended = false;
     return buffer;
    }

    this.ended = true;
    return buffer.slice(3);
  }

  toJSON() {
    return {
      type: ScriptDataObjectEnd.TYPE,
      ended: this.ended
    };
  }
};
