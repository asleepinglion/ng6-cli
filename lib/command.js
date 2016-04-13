var fs = require('fs');
var path = require('path');
var BaseClass = require('ouro-base');
var chalk = require('chalk');

module.exports = BaseClass.extend({

  init: function (cli) {

    this.cli = cli;

    //configure command options
    this.description = "This command's description has not been set yet.";
    this.options = '';
    this.order = 200;

  },

  run: function() {

    console.log(chalk.white('The ' + chalk.cyan('run') + ' method is not specified on the command.'));
  }

});