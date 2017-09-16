module.exports = class Tags {
  static get MIN_LENGTH() {
    return 11;
  }

  constructor() {
    this.type = 0x00;
    this.size = 0x00;
    this.timestamp = 0x00;
    this.streamId = 0x00;
    this.data = Buffer.alloc(0);
  }

  decode(buffer) {
    this.type = buffer.readUInt8(0);
    this.size = buffer.readUInt32BE(1) & 0x00ffffff;

    let ts0 = buffer.readUInt32BE(4) & 0x00ffffff;
    let ts1 = buffer.readUInt8(7);
    this.timestamp = ts0 | (ts1 << 24);

    this.streamId = buffer.readUInt32(10) & 0x00ffffff;
    switch (this.type) {
      case AudioData.TYPE:
        break;
      case VideoData.Type:
        break;
      case ScriptDataObject.TYPE:
        break;
    }
    process.exit(0);
  }

  toJSON() {}
};
