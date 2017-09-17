require('./helper/bufferReadUInt24');

const Header = require('./protocols/Header');
const Body = require('./protocols/Body');

module.exports = class FlvDemux {
  constructor() {
    this.state = Header.STATE;
    this.buffer = Buffer.alloc(0);
    this.header = new Header();
    this.body = new Body();
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
          
          this.state = Header.STATE;
          break;
        }
      }
    }
  }
};
