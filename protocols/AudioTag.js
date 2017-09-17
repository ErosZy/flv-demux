module.exports = class AudioTag {
  static get MIN_LENGTH() {
    return 0;
  }

  static get TYPE() {
    return 8;
  }

  constructor() {
    this.soundFormat = 0x01;
    this.soundRate = 0x01;
    this.soundSize = 0x01;
    this.soundType = 0x01;
    this.AACPacketType = -1;
    this.data = Buffer.alloc(0);
  }

  decode(buffer, size = 0) {
    this.soundFormat = (buffer.readUInt8(0) & 240) >> 4;
    if (!(this.soundFormat == 10 || this.soundFormat == 2)) {
      throw new Error('not support this audio type(only support MP3/AAC)');
    }

    this.soundRate = (buffer.readUInt8(0) & 12) >> 2;
    this.soundSize = (buffer.readUInt8(0) & 2) >> 1;
    this.soundType = buffer.readUInt8(0) & 1;

    if (this.soundFormat == 10) {
      this.AACPacketType = buffer.readUInt8(1);
      this.data = buffer.slice(2, size);
    } else {
      this.data = buffer.slice(1, size);
    }

    return buffer.slice(size);
  }

  toJSON() {
    return {
      soundFormat: this.soundFormat,
      soundRate: this.soundRate,
      soundSize: this.soundSize,
      soundType: this.soundType,
      AACPacketType: this.AACPacketType,
      data: this.data
    };
  }
};
