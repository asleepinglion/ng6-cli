var fs = require('fs');
var path = require('path');
var chalk = require('chalk');
var _ = require('lodash');
var semver = require('semver');
var Command = require('../../lib/command');

module.exports = Command.extend({

  init: function() {

    this._super.apply(this, arguments);

    this.description = 'Build the project with webpack.';
    this.options = '';
    this.order = 2;
  },

  getWebpackConfig: function(projectRoot) {
    var webpackConfigPath = '';

    var webpackProd = path.resolve(projectRoot + '/webpack.prod.config.js');
    var webpackProdBabel = path.resolve(projectRoot + '/webpack.prod.config.babel.js');
    var webpackRoot = path.resolve(projectRoot + '/webpack.config.js');
    var webpackRootBabel = path.resolve(projectRoot + '/webpack.config.babel.js');

    if( fs.existsSync(webpackProd) ) {
      webpackConfigPath = webpackProd;
    } else if( fs.existsSync(webpackProdBabel) ) {
      webpackConfigPath = webpackProdBabel;
    } else if( fs.existsSync(webpackRoot) ) {
      webpackConfigPath = webpackRoot;
    } else if( fs.existsSync(webpackRootBabel) ) {
      webpackConfigPath = webpackRootBabel;
    }

    if( this.cli.isEnabled('config') ) {
      webpackConfigPath = path.resolve(projectRoot, this.cli.request.getOption('config'));
    }

    if(!webpackConfigPath) {
      console.log();

      if( this.cli.isEnabled('config') ) {
        console.log(chalk.white('You specified a webpack config file at ' + chalk.yellow(webpackConfigPath) + ' but I was unable to find one ther.'));
      } else {
        console.log(chalk.white('Cannot find webpack.config looked at '
          + '\n\t' + chalk.yellow(webpackProd)
          + '\n\t' + chalk.yellow(webpackProdBabel)
          + '\n\t' + chalk.yellow(webpackRoot)
          + '\n\t' + chalk.yellow(webpackRoot)
        ));
      }
      console.log();
      process.exit(1);
    } else {
      console.log();
      console.log(chalk.white('using webpack config found at ' + chalk.green(webpackConfigPath)));
      console.log();
    }

    var webpackConfig = require(webpackConfigPath);

    if( _.isFunction(webpackConfig) ) {
      return webpackConfig({ prod: true }); // --env.prod
    }

    return webpackConfig;

  },

  run: function() {

    var projectRoot = this.cli.reflect.projectRoot();

    if( !projectRoot || projectRoot != process.cwd() ) {
      console.log('');
      console.log(chalk.white('You must be in the project root in order to execute build!'));
      console.log('');
      process.exit(1);
    }

    var webpackConfig = this.getWebpackConfig(projectRoot);

    var webpackVersion = require(path.resolve(projectRoot, 'node_modules', 'webpack', 'package.json')).version;

    var webpack;
    if( semver.satisfies(webpackVersion, '1.x') ) {
      this.webpackVersion = 1;
      webpack = require(path.resolve(projectRoot, 'node_modules', 'webpack'));
    } else {
      this.webpackVersion = 2;
      webpack = require('webpack');
    }

    console.log();
    console.log(chalk.white('Your using ' + chalk.cyan('webpack') + '@' + chalk.green(webpackVersion) + ' and we think you\'re using ' + chalk.green('v' + this.webpackVersion)));
    console.log();

    webpack(webpackConfig, function(err, stats) {
      if(err) {
        console.error(err);
        return;
      }

      console.log(stats.toString({
        colors: true
      }));
    });

  }

});
