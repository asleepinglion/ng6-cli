var fs = require('fs');
var path = require('path');
var chalk = require('chalk');
var webpack = require('webpack');
var Command = require('../../lib/command');

module.exports = Command.extend({

  init: function() {

    this._super.apply(this, arguments);

    this.description = "Build the project with webpack.";
    this.options = '';
    this.order = 2;
  },

  run: function() {

  	var projectRoot = this.cli.reflect.projectRoot();
    var webpackConfig = require(path.resolve(projectRoot + '/webpack.config'));
    var bundler = webpack(webpackConfig);

    console.log(chalk.white("Building project with webpack..."));
    console.log("");

    bundler.run(function(err, stats) {
      //console.log(stats);
      console.log('Successfully built to ' + stats.compilation.outputOptions.path);
      console.log("");
    });

  }
});