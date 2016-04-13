var path = require('path');
var pkg = require('../package.json');
var chalk = require('chalk');
var Cli = require('./cli');

module.exports = Cli.extend({

  init: function(config) {

    //default config
    config = config || {};

    //default config file
    config.optionsFile = config.configFile || '.ng6-cli';

    //set a default banner if undefined (set to false for no banner)
    if( config.banner === undefined ) {
      config.banner = chalk.cyan("\nNG6 CLI v"+pkg.version+"\n");
    }

    //execute parent constructor
    this._super(config);
  },

  load: function() {

    //add local command path
    this.commands.load(path.resolve(__dirname + '/../commands'));

    //execute parent config
    this._super();
  }

});