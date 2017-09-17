const ScriptDataString = require('./ScriptDataString');
const ScriptDataValue = require('./ScriptDataValue');

module.exports = class ScriptDataObject {
  static get MIN_LENGTH() {
    return ScriptDataString.MIN_LENGTH + ScriptDataValue.MIN_LENGTH;
  }

  constructor() {
    this.objectName = '';
    this.objectData = null;
  }

  decode(buffer, size = 0) {
    this.objectName = new ScriptDataString();
    buffer = this.objectName.decode(buffer);
    this.objectData = new ScriptDataValue();
    buffer = this.objectData.decode(buffer);
    return buffer;
  }

  toJSON() {
    let objectName = this.objectName;
    let objectData = this.objectData;
    objectName = objectName && objectName.toJSON ? objectName.toJSON() : '';
    objectData = objectData && objectData.toJSON ? objectData.toJSON() : null;

    return {
      objectName,
      objectData
    };
  }
};
