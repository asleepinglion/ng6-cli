/*
 Configuration options defined here will override the base configuration
 defined in the root webpack.config.js when using the `npm run build` command.
*/

var webpack = require('webpack');
var HtmlWebpackPlugin = require('html-webpack-plugin');
var ExtractTextPlugin = require('extract-text-webpack-plugin');
var WriteFilePlugin = require('write-file-webpack-plugin');
var webpackConfig = require('./webpack.config');

webpackConfig.devtool = 'source-map';

webpackConfig.plugins = [
  //extract all the compiled scss into a single css file.
  new ExtractTextPlugin('css/app.css', { allChunks: true }),

  // Injects bundles in your index.html instead of wiring all manually.
  // It also adds hash to all injected assets so we don't have problems
  // with cache purging during deployment.
  new HtmlWebpackPlugin({
    template: 'app/index.html',
    inject: 'body',
    hash: true
  }),

  // Removes duplicate modules from the build
  new webpack.optimize.DedupePlugin(),

  // Store all remaining chunks not part of the app into the common bundle.
  new webpack.optimize.CommonsChunkPlugin({
    name: 'common',
    filename: 'common.bundle.js'
  }),

  // Plugin which emits build on change, this is needed for ionic dev.
  new WriteFilePlugin()
];

module.exports = webpackConfig;
