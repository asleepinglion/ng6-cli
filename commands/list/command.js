var fs = require('fs');
var path = require('path');
var chalk = require('chalk');
var columnify = require('columnify');
var Command = require('../../lib/command');
var Reflect = require('../../lib/reflect');

module.exports = Command.extend({

  init: function() {

    this._super.apply(this, arguments);

    this.description = "List available artifacts, such as templates.";
    this.options = '[type]';
    this.order = 3;

  },

  run: function(type) {

    if( !type ) {
      return this.cli.commands.run('help', ['list']);
    } else {

      if( type === 'templates' ) {

        console.log(chalk.white("The following is list of available templates:"));
        console.log("");

        this.listTemplates();

        console.log("");

      } else {

        console.log(chalk.white("The " + type + " type is not currently supported."));
        console.log("");

      }
    }

  },

  listTemplates: function() {
    
    var self = this;

    self.cli.templates.types().map(function(type) {

      var templates = [];

      console.log(chalk.bold.white(type));

      Object.keys(self.cli.templates.byType(type)).map(function(template) {

        var template = self.cli.templates.get(type, template);

        templates.push({
          spacer: "",
          template: ":" + chalk.cyan(template.name),
          description: chalk.gray(template.description)
        });
        
      });

      if( templates.length  > 0 ) {
        console.log(columnify(templates, {
          showHeaders: false,
          config: {
            spacer: {
              minWidth: 1
            },
            template: {
              minWidth: 20
            },
            description: {
              maxWidth: 75
            }
          }
        }));
      }

    });

  }

});