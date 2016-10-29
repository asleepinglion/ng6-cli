var path = require('path');
var BrowserSyncPlugin = require('browser-sync-webpack-plugin');
var DashboardPlugin = require('webpack-dashboard/plugin');
var ExtractTextPlugin = require('extract-text-webpack-plugin');
var HtmlWebpackPlugin = require('html-webpack-plugin');
var WriteFilePlugin = require('write-file-webpack-plugin');

var paths = {
  output: path.join(__dirname, 'www/'),
  entry: path.resolve(__dirname, 'app/app.module.js'),
}

var devServer = {
  outputPath: paths.output,
  inline: true,
  historyApiFallback: true,
  port: 3100,
  stats: 'minimal',
};

module.exports = {

  devServer: devServer,

  devtool: 'eval-source-map',

  entry: {
    // Setup our main entry point for processing
    entry: paths.entry,

    // group these modules into a vendor bundle
    //vendor: ['angular', 'angular-ui-router', 'angular-animate', 'ionic', 'ocLazyLoad'],
  },

  //setup the output path
  output: {
    path: paths.output,
    filename: 'app.bundle.js',
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
        exclude: /(node_modules|hooks)/,
        loader: 'ng-annotate!babel?cacheDirectory'
      },
      {
        test: /\.css$/,
        loader: ExtractTextPlugin.extract('style', 'css', { publicPath: '../'})
      },
      //sass files with just the .scss suffix are processed normally allowing support for global css
      {
        test: /\.scss$/,
        loader: ExtractTextPlugin.extract('style', 'css!sass!sass-resources', { publicPath: '../'}),
        exclude: /\.module.scss$/
      },
      //sass files that have the .module.scss suffix will be processed with css-modules enabled (https://github.com/webpack/css-loader#css-modules)
      {
        test: /\.module.scss$/,
        loader: ExtractTextPlugin.extract('style', 'css?modules&camelCase&importLoaders=3&localIdentName=[name]__[local]___[hash:base64:5]!sass!sass-resources', { publicPath: '../'})
      },
      {
        test: /\.(gif|png|jpg|jpeg)$/,
        loader: 'url?limit=1024&name=images/[name].[ext]'
      },
      {
        test: /\.svg(\?v=\d+\.\d+\.\d+)?$/,
        loader: 'url?limit=1024&mimetype=image/svg+xml&name=images/[name].[ext]'
      },
      {
        test: /\.woff(2)?(\?v=\d+\.\d+\.\d+)?$/,
        loader: 'url?limit=1024&mimetype=application/font-woff&name=fonts/[name].[ext]'
      },
      {
        test: /\.ttf(\?v=\d+\.\d+\.\d+)?$/,
        loader: 'url?limit=1024&mimetype=application/octet-stream&name=fonts/[name].[ext]'
      },
      {
        test: /\.eot(\?v=\d+\.\d+\.\d+)?$/,
        loader: 'file?name=fonts/[name].[ext]'
      },
      {
        test: /\.otf(\?v=\d+\.\d+\.\d+)?$/,
        loader: 'file?name=fonts/[name].[ext]'
      },
      {
        test: /\.html$/,
        loader: 'raw'
      },
      {
        test: /\.json$/,
        loader: 'json'
      },
    ],
  },

  /*
   Sass resources are loaded before each required scss file.
   Do not include anything that actually renders CSS otherwise it will be injected into every file.
   */
  sassResources: [ './styles/_variables.scss' ],

  /*
   The following resolve blocks setup the fallback paths to search use
   when searching for modules. This is especially important when modules
   are installed via npm link.
   */
  resolve: {
    root: [path.resolve(__dirname, 'node_modules')],
    extensions: ['', '.js'],
    fallback: path.join(__dirname, 'node_modules'),
  },

  resolveLoader: {
    root: path.join(__dirname, 'node_modules'),
  },

  plugins: [
    //extract all the compiled scss into a single css file.
    new ExtractTextPlugin('css/app.css', { allChunks: true }),

    // Injects bundles in your index.html instead of wiring all manually.
    // It also adds hash to all injected assets so we don't have problems
    // with cache purging during deployment.
    new HtmlWebpackPlugin({
      template: 'app/index.html',
      inject: 'body',
      hash: true,
    }),

    new BrowserSyncPlugin(
      // BrowserSync options
      {
        host: 'localhost',
        port: 3000,
        // proxy the Webpack Dev Server endpoint
        // (which should be serving on http://localhost:3100/)
        // through BrowserSync
        proxy: 'http://localhost:3100/',
      },
      // plugin options
      {
        // prevent BrowserSync from reloading the page
        // and let Webpack Dev Server take care of this
        reload: false,
      }
    ),

    // see https://github.com/FormidableLabs/webpack-dashboard
    new DashboardPlugin(),

    // Plugin which emits build on change, may be needed for ionic dev.
    new WriteFilePlugin(),

  ]
};
