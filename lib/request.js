var fs = require('fs');
var path = require('path');
var BaseClass = require('ouro-base');
var chalk = require('chalk');
var yargs = require('yargs');

module.exports = BaseClass.extend({

  init: function(cli) {
    this.cli = cli;
    this.argv = yargs.argv;
    this.request = {};
    this.process();
  },

  process: function() {

    this.cli.bin = path.basename(yargs.argv['$0']);

    this.request.command = 'help';
    this.request.arguments = [];
    this.request.options = {};

    if( yargs.argv._.length > 0) {
      this.request.arguments = yargs.argv._;
      this.request.command = this.request.arguments.shift();

    }

    for( var prop in yargs.argv ) {
      if( ['_', '$0'].indexOf(prop) === -1 ) {
        this.request.options[prop] = yargs.argv[prop];
      }
    }
  },

  command: function() {
    return this.request.command;
  },

  options: function() {
    return this.request.options;
  },

  isEnabled: function(option) {
    return (this.request.options[option]) ? true : false;
  },

  getOption: function(option) {
    return this.request.options[option];
  },

  arguments: function() {
    return this.request.arguments;
  }


});