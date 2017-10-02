const fs = require('fs');
const FlvDemux = require('../index');

const UNIT_PREFIX = Buffer.from([0x00, 0x00, 0x00, 0x01]);

let readBufferSize = (buffer, lengthSizeMinusOne, offset) => {
  let results = 0;
  for (let i = 0; i < lengthSizeMinusOne; i++) {
    results |= buffer[offset + i] << ((lengthSizeMinusOne - 1 - i) * 8);
  }

  return results;
};

start();

function start() {
  let fd = fs.openSync('../videos/sample.flv', 'r');
  let stat = fs.fstatSync(fd);
  let buf = Buffer.alloc(stat.size);
  fs.readSync(fd, buf, 0, stat.size);

  console.log('[I] whole data parse start');

  let startTime = +new Date();
  let decoder = new FlvDemux.Decoder();

  decoder.on('header', header => {
    console.log(
      `[I] parse header success, hasAudio:${header.hasAudio}, hasVideo:${header.hasVideo}`
    );
  });

  let buffer = Buffer.alloc(0);
  let lengthSizeMinusOne;
  decoder.on('tag', tag => {
    if (tag.type == FlvDemux.VideoTag.TYPE) {
      if (tag.data.AVCPacketType == 0) {
        let unit = tag.data.data;
        let configurationVersion = unit.readUInt8(0);
        let AVCProfileIndication = unit.readUInt8(1);
        let profileCompatibility = unit.readUInt8(2);
        let AVCLevelIndication = unit.readUInt8(3);
        lengthSizeMinusOne = (unit.readUInt8(4) & 3) + 1;

        let numOfSequenceParameterSets = unit.readUInt8(5) & 0x1f;
        let sequenceParameterSetLength = unit.readUInt16BE(6);
        let sps = unit.slice(8, 8 + sequenceParameterSetLength);
        let numOfPictureParameterSets = unit.readUInt8(
          8 + sequenceParameterSetLength
        );
        let pictureParameterSetLength = unit.readUInt16BE(
          8 + sequenceParameterSetLength + 1
        );
        let pps = unit.slice(
          8 + sequenceParameterSetLength + 3,
          8 + sequenceParameterSetLength + 3 + pictureParameterSetLength
        );
        buffer = Buffer.concat([buffer, UNIT_PREFIX, sps, UNIT_PREFIX, pps]);
      } else if (tag.data.AVCPacketType == 1) {
        let size = tag.size - 5;
        let unit = tag.data.data;
        let tmp = [];
        while (size) {
          let NALULength = readBufferSize(unit, lengthSizeMinusOne, 0);
          let NALU = unit.slice(
            lengthSizeMinusOne,
            lengthSizeMinusOne + NALULength
          );
          tmp.push(UNIT_PREFIX, NALU);
          unit = unit.slice(lengthSizeMinusOne + NALULength);
          size -= lengthSizeMinusOne + NALULength;
        }
        tmp = [buffer].concat(tmp);
        buffer = Buffer.concat(tmp);
      } else if (tag.data.AVCPacketType == 2) {
        fs.writeFileSync('../videos/sample.h264', buffer);
        console.log('[I] parse end AVC chunk success');
      }
    }
  });

  decoder.decode(buf);

  console.log(`[I] time consuming: ${+new Date() - startTime}ms`);

  //parseChunkData();
}

function parseChunkData() {
  let fd = fs.openSync('../videos/sample.flv', 'r');
  let stat = fs.fstatSync(fd);

  console.log('--------------------------------');
  console.log('[I] chunk data parse start....');

  let startTime = +new Date();
  let decoder = new FlvDemux.Decoder();
  decoder.on('header', header => {
    console.log(
      `[I] parse header success, hasAudio:${header.hasAudio}, hasVideo:${header.hasVideo}`
    );
  });

  decoder.on('tag', tag => {
    if (tag.type == FlvDemux.VideoTag.TYPE) {
      if (tag.data.AVCPacketType == 2) {
        console.log('[I] parse end AVC chunk success');
      }
    }
  });

  let buf = Buffer.alloc(stat.size);
  fs.readSync(fd, buf, 0, stat.size);

  const PART_SIZE = 1024;
  while (buf.length) {
    body = buf.slice(0, PART_SIZE);
    decoder.decode(body);
    buf = buf.slice(PART_SIZE);
  }
  console.log(`[I] time consuming: ${+new Date() - startTime}ms`);
}
