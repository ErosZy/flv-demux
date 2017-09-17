const EventEmitter = require('events').EventEmitter;
const Header = require('./protocols/Header');
const Body = require('./protocols/Body');

module.exports = class FlvDemux extends EventEmitter {
  constructor() {
    super();
    this.state = Header.STATE;
    this.buffer = Buffer.alloc(0);
    this.header = new Header();
    this.body = new Body();

    this.header.on('header', this.headerDataHandler.bind(this));
    this.body.on('tag', this.tagDataHandler.bind(this));
  }

  decode(buffer, size = 0) {
    this.buffer = Buffer.concat([this.buffer, buffer]);

    for (;;) {
      switch (this.state) {
        case Header.STATE: {
          if (this.buffer.length < Header.MIN_LENGTH) {
            return;
          }

          let body = this.header.decode(this.buffer);
          if (!body) {
            throw new Error('not right spec header');
          }

          this.buffer = body;
          this.state = Body.STATE;
          break;
        }
        case Body.STATE: {
          if (this.buffer.length < Body.MIN_LENGTH) {
            return;
          }

          let body = this.body.decode(this.buffer);
          if (!body) {
            return;
          }

          this.buffer = body;
          break;
        }
      }
    }
  }

  destroy() {
    this.buffer = null;
    this.state = null;
    this.header.removeAllListeners();
    this.body.removeAllListeners();
    this.removeAllListeners();
  }

  headerDataHandler(header) {
    this.emit('header', header);
  }

  tagDataHandler(tag) {
    this.emit('tag', tag);
  }
};
