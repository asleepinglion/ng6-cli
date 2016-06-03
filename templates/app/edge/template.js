var path = require('path');
var chalk = require('chalk');
var Template = require('../../../lib/template');
var shell = require("shelljs");
var Spinner = require('cli-spinner').Spinner;

module.exports = Template.extend({

  init: function() {    
    this._super.apply(this, arguments);    
    this.description = 'The basic template Plus latest features & architectural patterns.'
  },
  
  done: function(name, destination) {

    var self = this;

    if( (self.cli.request.getOption('install') || self.cli.request.getOption('i')) ) {

      if( !shell.which('npm') ) {
        console.log("");
        console.log(chalk.white('The application was created, but could not find ' + chalk.cyan('npm') + ' to install dependencies!'));
        console.log("");
        return;
      }

      console.log(chalk.cyan(':: installing dependencies'), chalk.gray(' (this make take a few minutes)'));
      console.log();
      var spinner = new Spinner(chalk.cyan('%s'));
      spinner.start();

      shell.cd(destination);

      shell.exec("npm install", function(code, output) {

        spinner.stop();
        console.log(output);

        console.log("");
        console.log(chalk.white('First ' + chalk.cyan('cd ' + name) + ' to enter the project root.'));
        console.log(chalk.white('Simply run ' + chalk.cyan(self.cli.bin + ' serve') + ' to view the project locally!'));
        console.log("");

      });

    } else {

      console.log("");
      console.log(chalk.white('First ' + chalk.cyan('cd ' + name) + ' to enter the project root.'));
      console.log(chalk.white('Make sure to run ' + chalk.cyan('npm install') + ' to install dependencies!'));
      console.log(chalk.white('Then run ' + chalk.cyan(self.cli.bin + ' serve') + ' to view the project locally.'));
      console.log("");

    }
  }
});