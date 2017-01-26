var fs = require('fs');
var path = require('path');
var spawn = require('child_process').spawn;
var chalk = require('chalk');
var webpack = require('webpack');
var Command = require('../../lib/command');

module.exports = Command.extend({

  init: function() {

    this._super.apply(this, arguments);

    this.description = 'Build the project with webpack.';
    this.options = '';
    this.order = 2;
  },

  run: function() {

    var projectRoot = this.cli.reflect.projectRoot();

    if( !projectRoot || projectRoot != process.cwd() ) {
      console.log('');
      console.log(chalk.white('You must be in the project root in order to execute build!'));
      console.log('');
      process.exit(1);
    }

    var webpackConfig = null;

    var webpackRoot = path.resolve(projectRoot + '/webpack.config.js');
    var webpackProd = path.resolve(projectRoot + '/webpack.prod.config.js');

    if( fs.existsSync(webpackProd) ) {
      webpackConfig = require(webpackProd);
    } else if( fs.existsSync(webpackRoot) ) {
      webpackConfig = require(webpackRoot);
    }

    console.log(chalk.white('Building project with webpack by running `npm run build`'));
    console.log('');

    const serveProcess = spawn('npm', ['run', 'build'], { stdio: 'inherit', shell: true });

  }
});
