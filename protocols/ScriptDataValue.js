const ScriptDataString = require('./ScriptDataString');
const ScriptDataObject = require('./ScriptDataObject');
const ScriptDataObjectEnd = require('./ScriptDataObjectEnd');
const ScriptDataVar = require('./ScriptDataVar');
const ScriptDataVarEnd = require('./ScriptDataVarEnd');
const ScriptDataDate = require('./ScriptDataDate');
const ScriptDataLongString = require('./ScriptDataLongString');

class ScriptDataValue {
  static get MIN_LENGTH() {
    return 1;
  }

  static get TYPES() {
    return {
      NUMBER: 0,
      BOOLEAN: 1,
      STRING: 2,
      OBJECT: 3,
      MOVIECLIP: 4,
      NULL: 5,
      UNDEFINED: 6,
      REF: 7,
      ECMA_ARRAY: 8,
      STRICT_ARRAY: 10,
      DATE: 11,
      LONG_STRING: 12
    };
  }

  constructor() {
    this.type = 0x00;
    this.ECMAArrayLength = -1;
    this.value = null;
    this.terminator = null;
  }

  decode(buffer, size = 0) {
    const TYPES = ScriptDataValue.TYPES;
    this.type = buffer.readUInt8(0);

    switch (this.type) {
      case TYPES.NUMBER:
        this.value = buffer.readDoubleBE(1);
        buffer = buffer.slice(9);
        break;
      case TYPES.BOOLEAN:
        this.value = !!buffer.readUInt8(1);
        buffer = buffer.slice(2);
        break;
      case TYPES.STRING:
      case TYPES.MOVIECLIP:
        this.value = new ScriptDataString();
        buffer = this.value.decode(buffer);
        break;
      case TYPES.OBJECT:
        this.value = new ScriptDataObject();
        buffer = this.value.decode(buffer);
        this.terminator = new ScriptDataObjectEnd();
        buffer = this.terminator.decode(buffer);
        break;
      case TYPES.UNDEFINED:
        this.value = undefined;
      case TYPES.NULL:
        buffer = buffer.slice(1);
        break;
      case TYPES.REF:
        this.value = buffer.readUInt16BE(1);
        buffer = buffer.slice(3);
        break;
      case TYPES.ECMA_ARRAY:
      case TYPES.STRICT_ARRAY:
        this.ECMAArrayLength = buffer.readUInt32BE(1);
        this.value = [];
        buffer = buffer.slice(5);
        for (let i = 0, len = this.ECMAArrayLength; i < len; i++) {
          let item = new ScriptDataVar(ScriptDataValue);
          buffer = item.decode(buffer);
          this.value.push(item);
        }

        this.terminator = new ScriptDataVarEnd();
        buffer = this.terminator.decode(buffer);
        break;
      case TYPES.DATE:
        this.value = new ScriptDataDate();
        buffer = this.value.decode(buffer);
        break;
      case TYPES.LONG_STRING:
        this.value = new ScriptDataLongString();
        buffer = this.value.decode(buffer);
        break;
      default:
        throw new Error(`not support value type(${this.type})`);
    }

    return buffer;
  }

  toJSON() {
    let value = this.value;
    if (Object.prototype.toString.call(value) == '[object Array]') {
      value = value.map(v => {
        return v && v.toJSON ? v.toJSON() : v;
      });
    } else if (value && value.toJSON) {
      value = value.toJSON();
    }

    let terminator = this.terminator;
    terminator = terminator && terminator.toJSON ? terminator.toJSON() : null;
    
    return {
      type: this.type,
      ECMAArrayLength: this.ECMAArrayLength,
      value: value,
      terminator: terminator
    };
  }
}

ScriptDataVar.ScriptDataValueClass = ScriptDataValue;
module.exports = ScriptDataValue;
