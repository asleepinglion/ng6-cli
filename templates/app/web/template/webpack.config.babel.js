/* eslint comma-dangle: ["warn", "always-multiline"] */
// https://medium.com/@nikgraf/why-you-should-enforce-dangling-commas-for-multiline-statements-d034c98e36f8

const { resolve } = require('path');
const webpack = require('webpack');
const BrowserSyncPlugin = require('browser-sync-webpack-plugin');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const ExtractTextPlugin = require('extract-text-webpack-plugin');
const WriteFilePlugin = require('write-file-webpack-plugin');

/*
 getIfUtils will allow us to do ifProd()/ifDev()
 removeEmpty will remove `undefined` from arrays
 */
const { getIfUtils, removeEmpty } = require('webpack-config-utils');

const PATHS = {
  output: resolve(__dirname, 'build/'),
  app: resolve(__dirname, 'app/app.module.js'),
  nodeModules: resolve(__dirname, 'node_modules'), // This is here to solve issues with npm linking projects
};

const sassResources = [
  './styles/settings/global.scss',
  './styles/tools/**/*.scss',
];

module.exports = (env) => {
  // process.env variables
  const devServerPort = parseInt(process.env.PORT, 10) || 3000;

  const { ifDev, ifProd } = getIfUtils(env);

  // The actual config which is returned at the end of this function
  const webpackConfig = {

    // https://webpack.js.org/configuration/dev-server/
    devServer: {
      port: devServerPort,
      publicPath: `http://localhost:${devServerPort}/`,
      clientLogLevel: 'none',
      // https: true, // Uncomment this if you want to serve with https
      compress: true,
      historyApiFallback: true,
      watchOptions: {
        ignored: /node_modules/,
      },
    },

    // https://webpack.js.org/configuration/devtool/
    devtool: 'source-map',

    entry: {
      // Setup our main entry point for processing
      app: removeEmpty([
        ifDev(`webpack-dev-server/client?http://localhost:${devServerPort}/`),
        PATHS.app,
      ]),
    },

    // setup the output path
    output: {
      filename: '[name].bundle.js',
      path: PATHS.output,
      pathinfo: ifDev(),
    },

    bail: ifProd(),

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
        filename: 'css/app.css',
        allChunks: true,
      }),

      // Injects bundles in your index.html instead of wiring all manually.
      // It also adds hash to all injected assets so we don't have problems
      // with cache purging during deployment.
      new HtmlWebpackPlugin({
        template: 'app/index.html',
        inject: 'body',
        hash: true,
      }),

      // Forces webpack-dev-server program to write bundle files to the file system.
      // Useful for ionic dev when using ionic live-reloading.
      ifDev(new WriteFilePlugin({ log: false })),

      // Live reloading via BrowserSync
      ifDev(new BrowserSyncPlugin(
        // BrowserSync options
        {
          host: 'localhost',
          port: devServerPort + 1,
          open: false,
          logLevel: 'silent',
          logConnections: false,
          logFileChanges: false,
          logSnippets: false,
          // proxy the Webpack Dev Server endpoint through BrowserSync
          proxy: `http://localhost:${devServerPort}/`,
        },
        // plugin options
        {
          // prevent BrowserSync from reloading the page
          // and let Webpack Dev Server take care of this
          reload: false,
        }
      )),

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
      // Store all remaining chunks not part of the app into the common bundle.
      // ifProd(new webpack.optimize.CommonsChunkPlugin({
      //   name: 'common',
      //   filename: 'common.bundle.js',
      // })),
    ]),
  };

  return webpackConfig;
};
