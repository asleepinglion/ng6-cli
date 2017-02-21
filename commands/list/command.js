var chalk = require('chalk');
var columnify = require('columnify');
var Command = require('../../lib/command');

module.exports = Command.extend({

  init: function() {

    this._super.apply(this, arguments);

    this.description = 'List available templates by type...';
    this.category = 'scaffold';
    this.options = '[type]';
    this.order = 3;

  },

  run: function() {

    this.listTemplates();

  },

  listTemplates: function() {

    var self = this;

    console.log(chalk.white('To generate an artifact with the ' + chalk.cyan('new') + ' command you need to know the'));
    console.log(chalk.bold('template type') + chalk.white(' and ') + chalk.cyan.bold('name') + chalk.white(' (if other than the default).'));
    console.log();

    console.log(chalk.white(chalk.bold('Available Types & Templates:')));
    console.log();
    self.cli.templates.types().map(function(type) {

      var templates = [];

      console.log('  ' + chalk.bold(type));

      Object.keys(self.cli.templates.byType(type)).map(function(templateName) {

        var template = self.cli.templates.get(type, templateName);
        var templateDesc = chalk.gray(template.description);

        if( templateName !== template.name ) {
          templateDesc = chalk.gray('An alias for the ') + chalk.cyan(template.name) + chalk.gray(' template.');
        }

        templates.push({
          spacer: '',
          template: chalk.gray(' ') + chalk.cyan.bold(templateName),
          description: templateDesc
        });

      });

      if( templates.length  > 0 ) {
        console.log(columnify(templates, {
          showHeaders: false,
          config: {
            spacer: {
              minWidth: 2
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

    console.log();
    console.log(chalk.white('For more information on generating artifacts, try: ' + chalk.cyan('usk help new')));

  }

});
