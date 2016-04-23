var path = require('path');
var webpack = require('webpack');
var HtmlWebpackPlugin = require('html-webpack-plugin');

module.exports = {

  entry: {

    //setup our main entry point for processing
    entry: path.resolve(__dirname, 'app/app.module.js'),

    //group these modules into a vendor bundle
    vendor: ['angular', 'angular-ui-router', 'angular-animate']

  },

  //setup the output path 
  output: {
    path: path.resolve(__dirname, 'build'),
    filename: 'app.bundle.js'
  },

  /*
   Each of the following loaders objects describe the process
   to run a specific file types through. The loader attribute specifies
   loaders to use separated by an ! and is read from right to left.

   For example .js files are ran through babel and then ng-annotate, and
   .scss files are run through the sass loader, followed by the css loader,
   and finally through he style loader.

   Since we will often install modules via npm we do not want to exclude all
   node modules. In the loaders below we are explicitly excluding all node
   modules that do not start with the prefixes 'nu-' or 'usk-'.
   */
  module: {
    loaders: [
      {
        test: /\.less/,
        loader: 'style!css!less'
      },
      {
        test: /\.js$/,
        loader: 'ng-annotate!babel?presets='+require.resolve('babel-preset-es2015')
      },
      {
        test: /\.css$/,
        loader: 'style!css'
      },
      {
        test: /\.scss$/,
        loader: 'style!css!sass'
      },
      {
        test: /\.(png|jpg)$/,
        loader: 'url'
      },
      {
        test: /\.woff(2)?(\?v=[0-9]\.[0-9]\.[0-9])?$/,
        loader: "url-loader?limit=10000&minetype=application/font-woff"
      },
      {
        test: /\.(ttf|eot|svg|otf)(\?v=[0-9]\.[0-9]\.[0-9])?$/,
        loader: "file-loader"
      },
      {
        test: /\.html$/,
        loader: 'raw'
      }
    ]
  },


  /*
   The following resolve blocks setup the fallback paths to search use
   when searching for modules. This is especially important when modules
   are installed via npm link.
   */
  resolve: {
    extensions: [ '', '.js' ],
    fallback: path.join(__dirname, "node_modules")
  },

  resolveLoader: {
    root: path.join(__dirname, "node_modules")
  },

  plugins: [

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

    // Brings together common modules into the same chunk.
    new webpack.optimize.CommonsChunkPlugin({
      name: 'vendor',
      filename: 'vendor.bundle.js'
    })
  ]
};