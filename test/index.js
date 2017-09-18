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
  let halfSize = Math.floor(stat.size / 2);
  let buf = Buffer.alloc(halfSize);
  fs.readSync(fd, buf, 0, halfSize);

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
  decoder.decode(buf);

  setTimeout(() => {
    let buf = Buffer.alloc(stat.size - halfSize);
    fs.readSync(fd, buf, 0, stat.size - halfSize, halfSize);
    decoder.decode(buf);
    console.log('[I[ ALL TEST PASSED');
  }, 5000);
}
