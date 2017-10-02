var getConfig = require('hjs-webpack');

let config = getConfig({
  in: 'index.js',
  out: 'build',
  clearBeforeBuild: true
});

config.output.library = 'var';
config.output.libraryTarget = 'umd';

module.exports = config;
