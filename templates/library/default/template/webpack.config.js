/* eslint-disable */

var path = require('path');
var webpack = require('webpack');
var ExtractTextPlugin = require('extract-text-webpack-plugin');
var WriteFilePlugin = require('write-file-webpack-plugin');
var CopyWebpackPlugin = require('copy-webpack-plugin');

var entry = path.resolve(__dirname, 'library.module.js');
var output = path.resolve(__dirname, 'dist');
var outputName = 'bundle.js';

module.exports = {
  devtool: 'source-map',

  entry: [ entry ], //setup our main entry point for processing

  //setup the output path
  output: {
    path: output,
    filename: outputName,
    libraryTarget: 'umd',
  },

  externals: {
    'angular': 'angular',
  },

  /*
   Each of the following loaders objects describe the process
   to run specific file types through. The loader attribute specifies
   loaders to use separated by an ! and is read from right to left.

   For example .js files are ran through babel and then ng-annotate, and
   .scss files are run through the sass resources first, then the sass loader, followed by the css loader,
   and finally through the style loader.

   Since we will often install modules via npm we do not want to exclude all
   node modules.

   */
  module: {
    loaders: [
      {
        test: /\.js$/,
        exclude: /(node_modules|styles|docs)/,
        loader: 'ng-annotate!babel?cacheDirectory&compact',
      },
      {
        test: /\.css$/,
        loader: ExtractTextPlugin.extract('style', 'css', { publicPath: '../'}),
      },
      //sass files with just the .scss suffix are processed normally allowing support for global css
      {
        test: /\.scss$/,
        loader: ExtractTextPlugin.extract('style', 'css!sass!sass-resources', { publicPath: '../'}),
        exclude: /\.module.scss$/,
      },
      //sass files that have the .module.scss suffix will be processed with css-modules enabled (https://github.com/webpack/css-loader#css-modules)
      {
        test: /\.module.scss$/,
        loader: ExtractTextPlugin.extract('style', 'css?modules&camelCase&importLoaders=3&localIdentName=[name]__[local]___[hash:base64:5]!sass!sass-resources', { publicPath: '../'}),
      },
      {
        test: /\.(gif|png|jpg|jpeg)$/,
        loader: 'url?limit=1024&name=images/[name].[ext]',
      },
      {
        test: /\.svg(\?v=\d+\.\d+\.\d+)?$/,
        loader: 'url?limit=1024&mimetype=image/svg+xml&name=images/[name].[ext]',
      },
      {
        test: /\.woff(2)?(\?v=\d+\.\d+\.\d+)?$/,
        loader: 'url?limit=1024&mimetype=application/font-woff&name=fonts/[name].[ext]',
      },
      {
        test: /\.ttf(\?v=\d+\.\d+\.\d+)?$/,
        loader: 'url?limit=1024&mimetype=application/octet-stream&name=fonts/[name].[ext]',
      },
      {
        test: /\.eot(\?v=\d+\.\d+\.\d+)?$/,
        loader: 'file?name=fonts/[name].[ext]',
      },
      {
        test: /\.otf(\?v=\d+\.\d+\.\d+)?$/,
        loader: 'file?name=fonts/[name].[ext]',
      },
      {
        test: /\.html$/,
        loader: 'raw',
      },
      {
        test: /\.json$/,
        loader: 'raw',
      }
    ]
  },

  /*
   Sass resources are loaded before each required scss file.
   Do not include anything that actually renders CSS otherwise it will be injected into every file.
   */
   sassResources: [
     './styles/_variables.scss',
   ],

  /*
   The following resolve blocks setup the fallback paths to search use
   when searching for modules. This is especially important when modules
   are installed via npm link.
   */
  resolve: {
    extensions: ['', '.js'],
  },

  resolveLoader: {
    root: path.join(__dirname, 'node_modules'),
  },

  plugins: [
    //extract all the compiled scss into a single css file.
    new ExtractTextPlugin('bundle.css', { allChunks: true }),

    // Removes duplicate modules from the build
    new webpack.optimize.DedupePlugin(),

    // Using OldWatchingPlugin to avoid file watching issues experienced by Windows users.
    new webpack.OldWatchingPlugin(),

    // Copy sass files to dist in flat list
    new CopyWebpackPlugin([{
      from: '**/*.scss',
      to: 'styles',
      flatten: true
    }]),

    // Plugin which emits build on change
    new WriteFilePlugin(),

  ]
};
