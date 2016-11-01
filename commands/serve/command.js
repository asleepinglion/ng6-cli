var fs = require('fs');
var path = require('path');
var spawn = require('child_process').spawn;
var chalk = require('chalk');
var Command = require('../../lib/command');
var webpackValidate = require('../../lib/webpack-validator');

//todo: resolve issue with executing serve from somewhere other than project root.
//todo: support custom server?

module.exports = Command.extend({

  init: function() {

    this._super.apply(this, arguments);

    this.description = 'Watch, build, & serve the application in a local environment.';
    this.options = '';
    this.order = 1;
  },

  checkProject: function() {

    //resolve project root
    var projectRoot = this.cli.reflect.projectRoot();

    if( !projectRoot || projectRoot != process.cwd() ) {
      console.log('');
      console.log(chalk.white('You must be in the project root in order to execute serve!'));
      console.log('');
      process.exit(1);
    }

    var pkg = require(path.resolve('package.json'));
    var nodeModules = fs.readdirSync(path.resolve('node_modules'));
    var webpackInstalled = fs.existsSync(path.resolve('node_modules/webpack'));

    if( nodeModules.length > 0 && nodeModules.length < pkg.dependencies.length ) {
      console.log('');
      console.log(chalk.white('Some dependencies seem to be missing. Have you run ' + chalk.cyan('npm install') + '?'));
      console.log('');
      process.exit(1);
    }

    if( !webpackInstalled ) {
      console.log('');
      console.log(chalk.white('Webpack does not appear to be installed. Have you run ' + chalk.cyan('npm install') + '?'));
      console.log('');
      process.exit(1);
    }

  },

  run: function() {

    this.checkProject();

    var projectRoot = this.cli.reflect.projectRoot();

    var webpackConfig = false;

    var webpackRoot = path.resolve(projectRoot + '/webpack.config.js');
    var webpackDev = path.resolve(projectRoot + '/webpack.dev.config.js');

    if( fs.existsSync(webpackDev) ) {
      webpackConfig = require(webpackDev);
    } else if( fs.existsSync(webpackRoot) ) {
      webpackConfig = require(webpackRoot);
    }

    if( !this.cli.isEnabled('skip-validate') ){
      webpackValidate(webpackConfig);
    }

    const serveProcess = spawn('npm', ['run', 'serve'], { stdio: 'inherit' });

  }

});
