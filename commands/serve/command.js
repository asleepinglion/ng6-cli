var fs = require('fs');
var path = require('path');
var chalk = require('chalk');
var Command = require('../../lib/command');

//todo: resolve issue with executing serve from somewhere other than project root.
//todo: support custom server

module.exports = Command.extend({

  init: function() {

    this._super.apply(this, arguments);

    this.description = "Watch, build, & serve the application in a local environment.";
    this.options = '';
    this.order = 1;
  },

  run: function() {

    //resolve project root
    var projectRoot = this.cli.reflect.projectRoot();

    if( !projectRoot || projectRoot != process.cwd() ) {
      console.log("");
      console.log(chalk.white("You must be in the project root in order to execute serve!"));
      console.log("");
      process.exit(1);
    }

    var webpackConfig = false;

    var webpackRoot = path.resolve(projectRoot + '/webpack.config.js');
    var webpackDev = path.resolve(projectRoot + '/webpack.dev.config.js');

    if( fs.existsSync(webpackDev) ) {
      webpackConfig = require(webpackDev);
    } else if( fs.existsSync(webpackRoot) ) {
      webpackConfig = require(webpackRoot);
    }

    if( !webpackConfig ) {
      console.log("");
      console.log(chalk.white("Could not find a webpack configuration in the current directory!"));
      console.log("");
      process.exit(1);
    }

    //require browser sync along with webpack and middleware for it
    var browserSync = require('browser-sync').create();
    var webpack = require('webpack');
    var webpackDevMiddleware = require('webpack-dev-middleware');

    //create bundler from webpack config
    var bundler = webpack(webpackConfig);

    //reload on all devices when build complete
    bundler.plugin('done', function (stats) {
      browserSync.reload();
    });

    //setup browser sync configuration
    var browserSyncConfig = {

      server: 'app',
      open: true,
      logFileChanges: false,
      notify: false,
      middleware: [
        webpackDevMiddleware(bundler, {
          publicPath: webpackConfig.output.publicPath,
          stats: {
            colors: true
          }
        })
      ],

      files: [
        'app/css/*.css',
        'app/*.html'
      ]

    };

    //enable port customization
    if( this.cli.isEnabled('port') ) {
      browserSyncConfig.port = this.cli.request.getOption('port');
    } else if( this.cli.isEnabled('p') ) {
      browserSyncConfig.port = this.cli.request.getOption('p');
    }

    //initialize browser sync
    browserSync.init(browserSyncConfig);
    
  }
  
});