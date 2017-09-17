module.exports = class VideoTag {
  static get MIN_LENGTH() {
    return 0;
  }

  static get TYPE() {
    return 9;
  }

  constructor() {
    this.frameType = 0x01;
    this.codecId = 0x01;
    this.AVCPacketType = 0x01;
    this.compositionTime = 0x00;
    this.data = Buffer.alloc(0);
  }

  decode(buffer, size) {
    this.frameType = (buffer.readUInt8(0) & 240) >> 4;
    this.codecId = buffer.readUInt8(0) & 15;
    if (this.codecId != 7) {
      throw new Error('not support this video type(only AVC support)');
    }

    this.AVCPacketType = buffer.readUInt8(1);
    this.compositionTime = buffer.readInt32BE(2) >> 8;
    this.data = buffer.slice(5, size);

    return buffer.slice(size);
  }

  toJSON() {
    return {
      frameType: this.frameType,
      codecId: this.codecId,
      AVCPacketType: this.AVCPacketType,
      compositionTime: this.compositionTime,
      data: this.data
    };
  }
};
