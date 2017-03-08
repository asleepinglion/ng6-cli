/* eslint comma-dangle: ["warn", "always-multiline"] */
// https://medium.com/@nikgraf/why-you-should-enforce-dangling-commas-for-multiline-statements-d034c98e36f8

const { resolve } = require('path');
const webpack = require('webpack');
const ExtractTextPlugin = require('extract-text-webpack-plugin');
const WriteFilePlugin = require('write-file-webpack-plugin');
const CopyWebpackPlugin = require('copy-webpack-plugin');

/*
 getIfUtils will allow us to do ifProd()/ifDev()
 removeEmpty will remove `undefined` from arrays
 */
const { getIfUtils, removeEmpty } = require('webpack-config-utils');

const PATHS = {
  output: resolve(__dirname, 'dist/'),
  app: resolve(__dirname, 'library.module.js'),
  nodeModules: resolve(__dirname, 'node_modules'),
};

const sassResources = [
  './styles/_variables.scss',
];

const outputName = 'bundle.js';

module.exports = (env) => {
  // env variables
  const { ifDev, ifProd } = getIfUtils(env);

  const webpackConfig = {

    // https://webpack.js.org/configuration/devtool/
    devtool: 'source-map',

    entry: {
      // Setup our main entry point for processing
      library: [
        PATHS.app,
      ],
    },

    // setup the output path
    output: {
      filename: outputName,
      path: PATHS.output,
      pathinfo: ifDev(),
      libraryTarget: 'umd',
    },

    bail: ifProd(),

    externals: {
      'angular': 'angular',
    },


    resolve: {
      modules: [
        PATHS.nodeModules, // This is here to solve issues with npm linking projects
      ],
    },

    /*
     Each of the following loaders objects describe the process to run specific file types through.

     For example .scss files are run through the sass-resources-loader, then the sass-loader,
     followed by the css-loader, and finally through the style loader.
     */
    module: {
      rules: [
        {
          test: /\.js$/,
          exclude: /node_modules/,
          loader: 'babel-loader',
        },
        {
          test: /\.css$/,
          loader: ExtractTextPlugin.extract({
            fallback: 'style-loader',
            use: 'css-loader',
            publicPath: '../',
          }),
        },
        {
          test: /\.scss$/, // Sass files with just the .scss suffix are processed normally
          exclude: /\.module.scss$/,
          loader: ExtractTextPlugin.extract({
            publicPath: '../',
            fallback: 'style-loader',
            use: [
              {
                loader: 'css-loader',
                options: {
                  sourceMap: ifDev(),
                },
              },
              {
                loader: 'sass-loader',
                options: {
                  sourceMap: ifDev(),
                },
              },
              {
                loader: 'sass-resources-loader',
                options: {
                  resources: sassResources,
                },
              },
            ],
          }),
        },
        {
          test: /\.module.scss$/, // Sass files that have the .module.scss suffix will be processed with css-modules enabled (https://github.com/webpack/css-loader#css-modules)
          loader: ExtractTextPlugin.extract({
            publicPath: '../',
            fallback: 'style-loader',
            use: [
              {
                loader: 'css-loader',
                options: {
                  modules: true,
                  camelCase: true,
                  sourceMap: ifDev(),
                  importLoaders: 2,
                  localIdentName: '[name]__[local]___[hash:base64:5]',
                },
              },
              {
                loader: 'sass-loader',
                options: {
                  sourceMap: ifDev(),
                },
              },
              {
                loader: 'sass-resources-loader',
                options: {
                  resources: sassResources,
                },
              },
            ],
          }),
        },
        {
          test: /\.(gif|png|jpg|jpeg)$/,
          loader: 'url-loader',
          options: {
            limit: 1024,
            name: 'images/[name].[ext]',
          },
        },
        {
          test: /\.svg(\?v=\d+\.\d+\.\d+)?$/,
          loader: 'url-loader',
          options: {
            limit: 1024,
            mimetype: 'image/svg+xml',
            name: 'images/[name].[ext]',
          },
        },
        {
          test: /\.woff(2)?(\?v=\d+\.\d+\.\d+)?$/,
          loader: 'url-loader',
          options: {
            limit: 1024,
            mimetype: 'application/font-woff',
            name: 'fonts/[name].[ext]',
          },
        },
        {
          test: /\.ttf(\?v=\d+\.\d+\.\d+)?$/,
          loader: 'url-loader',
          options: {
            limit: 1024,
            mimetype: 'application/octet-stream',
            name: 'fonts/[name].[ext]',
          },
        },
        {
          test: /\.eot(\?v=\d+\.\d+\.\d+)?$/,
          loader: 'file-loader',
          options: {
            name: 'fonts/[name].[ext]',
          },
        },
        {
          test: /\.otf(\?v=\d+\.\d+\.\d+)?$/,
          loader: 'file-loader',
          options: {
            name: 'fonts/[name].[ext]',
          },
        },
        {
          test: /\.html$/,
          loader: 'raw-loader',
        },
      ],
    },

    plugins: removeEmpty([
      new webpack.LoaderOptionsPlugin({
        minimize: ifProd(),
        debug: ifDev(),
      }),

      // Extract all the compiled scss into a single css file.
      new ExtractTextPlugin({
        filename: 'bundle.css',
        allChunks: true,
      }),

      // Copy sass files to dist in flat list
      new CopyWebpackPlugin([{
        from: '**/*.scss',
        to: 'styles',
        flatten: true,
      }]),

      // Forces webpack-dev-server program to write bundle files to the file system.
      // Useful for ionic dev when using ionic live-reloading.
      ifDev(new WriteFilePlugin({ log: false })),

      // PROD
      ifProd(new webpack.DefinePlugin({
        'process.env': {
          NODE_ENV: '"production"',
        },
      })),
      ifProd(new webpack.optimize.UglifyJsPlugin({
        screw_ie8: true, // eslint-disable-line
        warnings: false,
      })),
    ]),
  };

  return webpackConfig;
};
