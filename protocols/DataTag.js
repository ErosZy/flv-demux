const ScriptDataObject = require('./ScriptDataObject');
const ScriptDataObjectEnd = require('./ScriptDataObjectEnd');

module.exports = class DataTag {
  static get MIN_LENGTH() {
    return 3;
  }

  static get TYPE() {
    return 18;
  }

  constructor() {
    this.buffer = Buffer.alloc(0);
    this.originBuffer = Buffer.alloc(0);
    this.objects = [];
  }

  decode(buffer, size = 0) {
    this.buffer = buffer.slice(0, size);
    let objMinLen = ScriptDataObject.MIN_LENGTH;
    let endMinLen = ScriptDataObjectEnd.MIN_LENGTH;

    for (;;) {
      let bufLen = this.buffer.length;

      // if buffer length cant be min length
      // we pass it to keep run next frames right
      if (!bufLen || bufLen < objMinLen + endMinLen) {
        break;
      }

      let object = new ScriptDataObject();
      this.buffer = object.decode(this.buffer);
      this.objects.push(object);
    }

    this.originBuffer = buffer.slice(0, size);
    return buffer.slice(size);
  }

  toJSON() {
    let objects = this.objects.map(v => {
      return v && v.toJSON ? v.toJSON() : v;
    });

    return {
      objects: objects
    };
  }
};
