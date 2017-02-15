var fs = require('fs');
var path = require('path');
var chalk = require('chalk');
var _ = require('lodash');
var Command = require('../../lib/command');

module.exports = Command.extend({

  init: function() {

    this._super.apply(this, arguments);

    this.description = 'Build the project with webpack.';
    this.options = '';
    this.order = 2;
  },

  checkProject: function() {

    //resolve project root
    var projectRoot = this.cli.reflect.projectRoot();

    if( !projectRoot || projectRoot != process.cwd() ) {
      console.log();
      console.log(chalk.white('You must be in the project root in order to execute serve!'));
      console.log();
      process.exit(1);
    }

    var nodeModulesExists = fs.existsSync(path.join(projectRoot, 'node_modules'));

    if( !nodeModulesExists ) {
      console.log();
      console.log(chalk.white('All dependencies seem to be missing. Have you run ' + chalk.cyan('npm install') + ' or ' + chalk.cyan('yarn') + '?'));
      console.log();
      process.exit(1);
    }

    var nodeModules = fs.readdirSync(path.join(projectRoot, 'node_modules'));
    var pkg = require(path.join(projectRoot, 'package.json'));

    if( nodeModules.length < (pkg.dependencies.length + pkg.devDependencies.length) ) {
      console.log();
      console.log(chalk.white('Some dependencies seem to be missing. Have you run ' + chalk.cyan('npm install') + ' or ' + chalk.cyan('yarn') + '?'));
      console.log();
      process.exit(1);
    }

    var webpackExists = fs.esistsSync(path.join(projectRoot, 'node_modules', 'webpack'));

    if( !webpackExists ) {
      console.log();
      console.log(chalk.white('webpack seems to be missing. Have you run ' + chalk.cyan('npm install') + ' or ' + chalk.cyan('yarn') + '?'));
      console.log();
      process.exit(1);
    }

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

    this.checkProject();

    var projectRoot = this.cli.reflect.projectRoot();

    if( !projectRoot || projectRoot != process.cwd() ) {
      console.log();
      console.log(chalk.white('You must be in the project root in order to execute build!'));
      console.log();
      process.exit(1);
    }

    var webpackConfig = this.getWebpackConfig(projectRoot);

    var webpack = require(path.resolve(projectRoot, 'node_modules', 'webpack'));

    webpack(webpackConfig, function(err, stats) {
      if(err) {
        console.error(err);
        return;
      }

      console.log(stats.toString({
        colors: true,
        chunks: false
      }));
    });

  }

});
