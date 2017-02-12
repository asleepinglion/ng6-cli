var fs = require('fs');
var chalk = require('chalk');
var marked = require('marked');
var TerminalRenderer = require('marked-terminal');
var columnify = require('columnify');
var Command = require('../../lib/command');
var _ = require('lodash');
var ejs = require('ejs');
var categories = require('../../categories.json');
var wrap = require('word-wrap');

module.exports = Command.extend({

  init: function() {

    this._super.apply(this, arguments);

    this.description = 'Display this list of help, or help for a specific command.';
    this.options = '[command]';
    this.category = "other";
    this.order = '500';

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

      var template = ejs.compile(fs.readFileSync(this.cli.commands.get(name).cmdPath  + '/help.md').toString());
      var context = {
        cli: {
          bin: this.cli.bin,
          config: this.cli.config.config,
          request: this.cli.request.request
        }
      };
      console.log(marked(template(context)));
    } else {
      this.displayHelp();
    }

  },

  displayHelp: function() {

    var self = this;
    var commandList = [];
    var commandsToPrint = [];

    console.log(chalk.white("Getting started is easy! Create an app with "+chalk.cyan(this.cli.bin+" new")+" or "+chalk.cyan(this.cli.bin+" clone")+" an existing project."));
    console.log(chalk.white("If you need more help with a specific command try: ")+chalk.cyan(this.cli.bin + ' help'), chalk.gray('[command]'));
    console.log();
    console.log(chalk.white(chalk.bold('Usage:')), chalk.cyan(this.cli.bin), chalk.white('[command]'), chalk.gray('[args...]'), chalk.gray('[options]'));

    //convert command list into array
    Object.keys(this.cli.commands.all()).map(function(commandName) {
      commandList.push(self.cli.commands.get(commandName));
    });

    //group commands by category
    commandList = _.groupBy(commandList, 'category');

    //loop through categories
    Object.keys(categories).map(function(category) {

      //localize the commands in this category
      var categoryCommands = commandList[category];

      //only list category if commands exist
      if( categoryCommands && categoryCommands.length > 0 ) {

        console.log();

        //sort by the order value
        categoryCommands = _.orderBy(categoryCommands, 'order');

        //display category heading
        console.log(chalk.bold(chalk.white("» "+categories[category].name)) + chalk.gray(" - " + categories[category].shortDescription));
        //console.log();
        //console.log(chalk.gray(wrap(categories[category].description, {width: 70})));
        console.log();

        categoryCommands.map(function(command) {

          commandsToPrint.push({
            spacer: '',
            command: self.commandToString(command),
            description: chalk.white(command.description)
          });
        });

        self.writeColumns(commandsToPrint);
        commandsToPrint = [];

      }

    });

  },

  writeColumns: function(columns) {
    console.log(columnify(columns, {
      showHeaders: false,
      config: {
        spacer: {
          minWidth: 1
        },
        command: {
          minWidth: 25
        },
        description: {
          maxWidth: 75
        }
      }
    }));
  },

  commandToString: function(command) {

    var commandName = command.name;
    var commandOptions = this.optionsToString(command.options);
    var dots = 25;
    var dotsStr = '';

    dots -= commandName.length;

    var commandStr = chalk.bold.cyan(command.name);
    if( commandOptions.length ) {
      commandStr += ' ' + chalk.gray(commandOptions);
      dots -= commandOptions.length+1;
    }

    for( var i = 0; i < dots; i++ ) {
      dotsStr += '.';
    }

    commandStr  += ' ' + chalk.gray(dotsStr);

    return commandStr;
  },

  optionsToString: function(options) {
    var optionsString =  '';

    if(typeof options === 'object') {
      optionsString = Object.keys(options).map(function(option){
        return '[' + option + ']';
      });
      optionsString = optionsString.join(' ');
    } else {
      optionsString = options;
    }
    return optionsString;
  }

});
