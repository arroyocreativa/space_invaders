const path = require('path');

module.exports = {
  entry: "./lib/space_invaders.js",
  output: {
    filename: "bundle.js",
    path: path.resolve(__dirname)
  },
  devtool: 'source-map'
};
