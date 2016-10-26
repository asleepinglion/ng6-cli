var fs = require('fs');
var path = require('path');
var chalk = require('chalk');
var webpack = require('webpack');
var Command = require('../../lib/command');
var WebpackValidator = require('../../lib/webpack-validator');
var webpackValidator = new WebpackValidator();

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

    var webpackConfig = false;

    var webpackRoot = path.resolve(projectRoot + '/webpack.config.js');
    var webpackProd = path.resolve(projectRoot + '/webpack.prod.config.js');

    if( fs.existsSync(webpackProd) ) {
      webpackConfig = require(webpackProd);
    } else if( fs.existsSync(webpackRoot) ) {
      webpackConfig = require(webpackRoot);
    }

    if( !webpackValidator.check(webpackConfig) ) {
      console.log('');
      console.log(chalk.white('The webpack configuration does not appear to be valid!'));
      console.log('');
      process.exit(1);
    }

    var bundler = webpack(webpackConfig);

    console.log(chalk.white('Building project with webpack...'));
    console.log('');

    bundler.run(function (err, stats) {
      console.log('');
      console.log(stats.toString({colors: true}));
    });

  }
});
