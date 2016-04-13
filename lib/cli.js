var fs = require('fs');
var path = require('path');
var BaseClass = require('ouro-base');
var chalk = require('chalk');
var _ = require('lodash');

var Config = require('./config');
var Request = require('./request');
var Commands = require('./commands');
var Templates = require('./templates');
var Reflect = require('./reflect');
var Refactor = require('./refactor');
var Generate = require('./generate');

module.exports = BaseClass.extend({
  
  init: function(config) {

    //initialize
    this.reflect = new Reflect(this);
    this.config = new Config(this, config);
    this.request = new Request(this);
    this.commands = new Commands(this);
    this.templates = new Templates(this);
    this.generate = new Generate(this);
    this.refactor = new Refactor(this);

    //boot up
    this.displayBanner();
    this.load();
    this.run();
  },

  displayBanner: function() {

    //display banner
    if( this.config.isEnabled('banner') ) {
      console.log(this.config.get('banner'));
    }

  },

  load: function() {

    //load base templates
    this.templates.load(path.resolve(__dirname + '/../templates'));

    //load base commands
    this.commands.load(path.resolve(__dirname + '/../commands'));

  },

  isEnabled: function(option) {
    if( this.config.isEnabled(option) ) {
      return true;
    } else if( this.request.isEnabled(option) ) {
      return true;
    } else {
      return false;
    }
  },

  run: function() {

    if( this.isEnabled('debug') ) {
      console.log(chalk.gray(':: request:', JSON.stringify(this.request.request)));
    }

    //make sure command exists
    if (this.commands.exists(this.request.command())) {

      //execute command with arguments
      this.commands.run(this.request.command(), this.request.arguments());

    } else {

      //display help if command not found
      return this.commands.run('help');
    }
  }
  
});  