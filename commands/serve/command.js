var fs = require('fs');
var path = require('path');
var chalk = require('chalk');
var Command = require('../../lib/command');

//todo: resolve issue with executing serve from somewhere other than project root.
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
      console.log(chalk.white("You must be in the project root in order to execute serve!"));
      console.log("");
      process.exit(1);
    }

    /**
     * Require Browsersync along with webpack and middleware for it
     */
    var browserSync          = require('browser-sync').create();
    var webpack              = require('webpack');
    var webpackDevMiddleware = require('webpack-dev-middleware');



    /**
     * Require ./webpack.config.js and make a bundler from it
     */
    var webpackConfig = require(path.resolve(projectRoot + '/webpack.config'));
    var bundler       = webpack(webpackConfig);

    /**
     * Reload all devices when bundle is complete
     * or send a fullscreen error message to the browser instead
     */
    bundler.plugin('done', function (stats) {

      /*
      if (stats.hasErrors() || stats.hasWarnings()) {
        return browserSync.sockets.emit('fullscreen:message', {
          title: "Webpack Error:",
          body:  stripAnsi(stats.toString()),
          timeout: 100000
        });
      }
      */

      browserSync.reload();
    });

    var browserSyncConfig = {
      server: 'app',
      open: true,
      logFileChanges: false,
      notify: false,
      middleware: [
        webpackDevMiddleware(bundler, {
          publicPath: webpackConfig.output.publicPath,
          stats: {colors: true}
        })
      ],
      //plugins: ['bs-fullscreen-message'],
      files: [
        'app/css/*.css',
        'app/*.html'
      ]
    };

    if( this.cli.isEnabled('port') ) {
      browserSyncConfig.port = this.cli.getConfigValue(port);
    } else if( this.cli.isEnabled('p') ) {
      browserSyncConfig.port = this.cli.getConfigValue(p);
    }

    /**
     * Run Browsersync and use middleware for Hot Module Replacement
     */
    browserSync.init(browserSyncConfig);


  }
  
});