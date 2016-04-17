var fs = require('fs');
var path = require('path');
var chalk = require('chalk');
var marked = require('marked');
var TerminalRenderer = require('marked-terminal');
var columnify = require('columnify');
var Command = require('../../lib/command');
var _ = require('lodash');

module.exports = Command.extend({

  init: function(cli) {

    this._super.apply(this, arguments);
    
    this.description = 'Display this list of help, or help for a specific command.';
    this.options = '[command]';
    this.order = '400';

    //setup options for the marked-terminal renderer
    marked.setOptions({

      // Define custom renderer
      renderer: new TerminalRenderer({
        showSectionPrefix: false,
        firstHeading: chalk.bold.white,
        strong: chalk.bold.cyan,
        em: chalk.white
      })
    });

  },

  run: function(name) {

    //display specific command help if option specified
    if( name && this.cli.commands.exists(name) && fs.existsSync(this.cli.commands.get(name).cmdPath + '/help.md') ) {
      console.log(marked(fs.readFileSync(this.cli.commands.get(name).cmdPath  + '/help.md').toString()));
    } else {
      this.displayHelp();
    }

  },

  displayHelp: function() {

    var self = this;

    console.log(chalk.white("Usage:"), chalk.cyan(this.cli.bin), chalk.gray("[options]"), chalk.gray('[command]'), chalk.gray('[arg...]'));
    console.log("");
    console.log(chalk.white("Available Commands:"));

    console.log("");

    var commandList = [];

    Object.keys(this.cli.commands.all()).map(function(commandName) {
      commandList.push(self.cli.commands.get(commandName));
    });

    commandList = _.orderBy(commandList, 'order');

    var availableCommands = [];

    commandList.map(function(command) {

      var options =  "";

      if(typeof command.options === 'object') {
        options = Object.keys(command.options).map(function(option){
          return '[' + option + ']';
        });
        options = options.join(" ");
      } else {
        options = command.options;
      }

      availableCommands.push({
        spacer: "",
        command: chalk.bold.cyan(command.name) + " " + chalk.gray(options),
        description: chalk.white(command.description)
      });

    });

    console.log(columnify(availableCommands, {
      showHeaders: false,
      config: {
        spacer: {
          minWidth: 1
        },
        command: {
          minWidth: 30,
          paddingChr: '.'
        },
        description: {
          maxWidth: 75
        }
      }
    }));

    console.log("");
    
    console.log(chalk.white("For help with a specific command:"), chalk.cyan(this.cli.bin + " help"), chalk.gray("[command]"));

  }

});