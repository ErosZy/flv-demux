Buffer.prototype.readUInt24BE = function(index) {
  let b0 = this.readUInt8(index + 0);
  let b1 = this.readUInt8(index + 1);
  let b2 = this.readUInt8(index + 2);
  return (b0 << 16) | (b1 << 8) | b2;
};
