var fs = require('fs');
var path = require('path');
var chalk = require('chalk');

var gulp = require('gulp');
var rename = require('gulp-rename');
var template = require('gulp-template');
var columnify = require('columnify');

var Command = require('../../lib/command');

module.exports = Command.extend({

  init: function() {

    this._super.apply(this, arguments);
    
    this.templates = this.cli.templates;

    this.description = "Scaffold a new app, component, service, command, or template.";
    this.options = '[type] [name]';
    this.order = 2;

  },

  run: function(type, name) {

    //todo: use inquirer to ask questions if type/name are not passed via arguments.
    if( !type || !name ) {
      return this.cli.commands.run('help', ['new']);
    } else {

      var template = 'default';

      if( type.split(":").length > 1) {
        template = type.split(":")[1];
        type = type.split(":")[0];
      }

      if( this.cli.request.options.t ) {
        template = this.cli.request.options.t;
      } else if( this.cli.request.options.template ) {
        template = this.cli.request.options.template;
      }

      if( type === 'app' ) {
        this.cli.generate.app(template, name);
      } else {
        this.cli.generate.artifact(type, template, name);
      }

    }

  }

});