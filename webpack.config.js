const path = require('path');

const BUILD_DIR = path.resolve(__dirname, 'dist/');
const APP_DIR = path.resolve(__dirname, 'src/');

module.exports = {
  entry: APP_DIR + '/index.js',

  output: {
    path: BUILD_DIR,
    filename: 'app.js'
  },

  mode: process.env.MODE || 'production',

  module: {
    rules: [{
      test: /\.sass$/, // test for .sass files
      use: [
        {loader: "style-loader"}, // creates style nodes from JS strings
        {loader: "css-loader"},   // translates CSS into CommonJS
        {loader: "sass-loader"}   // compiles Sass to CSS
      ]
    }, {
      test: /\.css$/, // test for .css files
      use: [
        {loader: "style-loader"}, // creates style nodes from JS strings
        {loader: "css-loader"}    // translates CSS into CommonJS
      ]
    }]
  }
};
