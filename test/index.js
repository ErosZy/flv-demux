const fs = require('fs');
const Demux = require('../index');

start();

function start() {
  let fd = fs.openSync('../videos/sample.flv', 'r');
  let stat = fs.fstatSync(fd);
  let buf = Buffer.alloc(stat.size);
  fs.readSync(fd, buf, 0, stat.size);

  console.log('whole data parse start....');
  let startTime = +new Date();
  let demux = new Demux();
  demux.decode(buf);
  console.log(`time consuming: ${+new Date() - startTime}ms`);

  parseChunkData();
}

function parseChunkData() {
  let fd = fs.openSync('../videos/sample.flv', 'r');
  let stat = fs.fstatSync(fd);
  let halfSize = Math.floor(stat.size / 2);
  let buf = Buffer.alloc(halfSize);
  fs.readSync(fd, buf, 0, halfSize);

  console.log('chunk data parse start....');
  let startTime = +new Date();
  let demux = new Demux();
  demux.decode(buf);

  setTimeout(() => {
    let buf = Buffer.alloc(stat.size - halfSize);
    fs.readSync(fd, buf, 0, stat.size - halfSize, halfSize);
    demux.decode(buf);
    console.log('ALL TEST PASSED');
  }, 5000);
}
