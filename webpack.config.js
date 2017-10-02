var getConfig = require('hjs-webpack');

module.exports = getConfig({
  in: 'index.js',
  out: 'build',
  clearBeforeBuild: true
});
