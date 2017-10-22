const fs = require('fs');
const FlvDemux = require('../index');

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

  decoder.on('tag', tag => {
    if (tag.type == FlvDemux.VideoTag.TYPE) {
      if (tag.data.AVCPacketType == 2) {
        console.log('[I] parse end AVC chunk success');
      }
    }
  });

  decoder.decode(buf);

  console.log(`[I] time consuming: ${+new Date() - startTime}ms`);

  parseChunkData();
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

  revert();
}

function revert(){
  let fd = fs.openSync('../videos/sample.flv', 'r');
  let stat = fs.fstatSync(fd);
  let buf = Buffer.alloc(stat.size);
  fs.readSync(fd, buf, 0, stat.size);

  console.log('--------------------------------');
  console.log('[I] revert flv start...');

  let startTime = +new Date();
  let decoder = new FlvDemux.Decoder();

  let tmp = [];
  decoder.on('header', header => {
    tmp.push(header.originBuffer);
  });

  decoder.on('tag', tag => {
    tmp.push(tag.tagSizeBuffer, tag.originBuffer);
    if (tag.type == FlvDemux.VideoTag.TYPE) {
      if (tag.data.AVCPacketType == 2) {
        fs.writeFileSync('../videos/revert.flv', Buffer.concat(tmp));
      }
    }
  });

  decoder.decode(buf);

  console.log(`[I] time consuming: ${+new Date() - startTime}ms`);
}
