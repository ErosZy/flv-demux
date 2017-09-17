const ScriptDataString = require('./ScriptDataString');
let ScriptDataValue = null;

module.exports = class ScriptDataVar {
  static get MIN_LENGTH() {
    return ScriptDataString.MIN_LENGTH + ScriptDataValue.MIN_LENGTH;
  }

  static set ScriptDataValueClass(iClass) {
    ScriptDataValue = iClass;
  }

  constructor(ScriptDataValue) {
    this.varName = '';
    this.varData = null;
  }

  decode(buffer, size = 0) {
    this.varName = new ScriptDataString(true);
    buffer = this.varName.decode(buffer);
    this.varData = new ScriptDataValue();
    buffer = this.varData.decode(buffer);
    return buffer;
  }

  toJSON() {
    let varName = this.varName;
    varName = varName && varName.toJSON ? varName.toJSON() : '';
    let varData = this.varData;
    varData = varData && varData.toJSON ? varData.toJSON() : null;

    return {
      varName,
      varData
    };
  }
};
