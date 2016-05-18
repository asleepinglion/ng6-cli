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

//todo: detect proper project setup
//todo: check for latest version of tooling?
//todo: display new features or other info on startup?
//todo: support installed commands & templates

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

    //determine bin command
    this.bin = this.config.get('bin') || 'not_set';

    //boot up
    this.displayBanner();

    //Commands & templates within the current directory or at the project root should
    //always take precedence above ones packaged in the CLI.

    //todo: check that we have permission first

    //load default configuration
    this.config.load(path.resolve(__dirname + '/../.cli-defaults'));

    //load extended cli, project, and user level configs
    this.configure();

    //load templates in current directory
    this.templates.load(path.resolve(process.cwd() + '/templates'));

    //load commands in current directory
    this.templates.load(path.resolve(process.cwd() + '/commands'));

    //load project templates
    this.templates.load(path.resolve(this.reflect.projectRoot() + '/templates'));

    //load project commands
    this.commands.load(path.resolve(this.reflect.projectRoot() + '/commands'));

    //load commands & templates
    this.load();

    //run the requested command
    this.run();
  },

  displayBanner: function() {

    //display banner
    if( this.config.isEnabled('banner') ) {
      console.log(this.config.get('banner'));
    }

  },

  configure: function() {

    //load user configuration
    this.config.load(path.resolve(this.reflect.userHome() + '/' + this.config.get('optionsFile')));

    //load project configuration
    this.config.load(path.resolve(this.reflect.projectRoot() + '/' + this.config.get('optionsFile')));

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

  getOption: function(option) {
    if( this.config.isEnabled(option) ) {
      return this.config.get(option);
    } else if( this.request.isEnabled(option) ) {
      return this.request.getOption(option);
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