const fs = require('fs');
const Demux = require('../index');

let fd = fs.openSync('../videos/sample.flv', 'r');
let buf = Buffer.alloc(1024 * 1024);
fs.readSync(fd, buf, 0, 1024 * 1024);

let demux = new Demux();
demux.decode(buf);
