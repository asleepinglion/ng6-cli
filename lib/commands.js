var fs = require('fs');
var path = require('path');
var BaseClass = require('ouro-base');
var chalk = require('chalk');

module.exports = BaseClass.extend({

  init: function(cli) {

    this.cli = cli;
    this.commands = {};
    this.paths = [];
  },

  load: function(searchPath) {

    //maintain reference to self
    var self = this;

    if (fs.existsSync(searchPath) && this.paths.indexOf(searchPath) === -1 ) {

      //keep track of searched paths
      this.paths.push(searchPath);

      if( self.cli.isEnabled('debug') ) {
        console.log(chalk.gray(':: loading commands:', searchPath));
      }

      //get list of files in search path
      var commands = fs.readdirSync(searchPath);

      //loop through list of files
      commands.map(function (commandName) {

        //don't load command if one has already been loaded with the same name
        if( !self.commands[commandName] ) {

          if (fs.existsSync(path.resolve(searchPath + '/' + commandName + '/command.js'))) {

            if( self.cli.isEnabled('debug') ) {
              console.log(chalk.gray(':: loading command:', commandName));
            }

            //load the command class
            var Command = require(path.resolve(searchPath + '/' + commandName + '/command.js'));

            //instantiate the command
            self.commands[commandName] = new Command(self.cli);

            //set the command path
            self.commands[commandName].cmdPath = path.resolve(searchPath + '/' + commandName);

            //set the command name based on the folder
            self.commands[commandName].name = commandName;

            //default the command order
            if( !self.commands[commandName].order ) {
              self.commands[commandName].order = 250;
            }
          }
        }

      });
    }

  },

  exists: function(commandName) {
    if( this.commands[commandName] ) {
      return true;
    } else {
      return false;
    }
  },

  get: function(commandName) {
    return this.commands[commandName];
  },

  all: function() {
    return this.commands;
  },

  run: function(commandName, cmdArgs) {
    if( this.exists(commandName) ) {
      this.commands[commandName].run.apply(this.commands[commandName], cmdArgs);
    } else {
      return false;
    }
  }

});