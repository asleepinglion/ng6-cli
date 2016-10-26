var fs = require('fs');
var path = require('path');
var Command = require('../../lib/command');
var chalk = require('chalk');
var Case = require('case');

module.exports = Command.extend({

  init: function() {

    this._super.apply(this, arguments);
    this.description = 'Copy an artifact to a new location.';
    this.options = '';
    this.order = 12;

  },

  moduleFilePath: function(source) {

    var filePath = false;

    fs.readdirSync(source).map(function(file) {

      if( file.indexOf('.module.js') > -1 ) {
        filePath = path.resolve(source + '/' + file);
      }

    });

    return filePath;
  },

  validateSource: function(source) {

    if( fs.existsSync(source) ) {

      if (path.extname(source).length > 0 ) {
        console.log(chalk.white('\nThe source should be a folder and must not have an extension.\n'));
        process.exit(1);
      }

      if( !fs.existsSync(this.moduleFilePath(source)) ) {
        console.log(chalk.white('\nThe source does not contain a module file.\n'));
        process.exit(1);
      }

    } else {
      console.log(chalk.white('\nThe source does not exist.\n'));
      process.exit(1);
    }

  },

  validateDest: function(dest) {
    if( fs.existsSync(dest) && !this.cli.isEnabled('force') ) {
      console.log(chalk.white('\nThe destination already exists, use the ' + chalk.cyan('--force') + ' option to overwrite.\n'));
      process.exit(1);
    } else {

      if (path.extname(dest).length > 0 ) {
        console.log(chalk.white('\nThe destination should be a folder and must not have an extension.\n'));
        process.exit(1);
      }
    }
  },

  run: function(source, dest) {

    var self = this;

    //make sure we're passing in both the source and destination
    if( !source || !dest ) {
      console.log(chalk.white('\nYou must provide both a source and destination to copy a module.\n'));
      process.exit(1);
    }

    //resolve provided paths
    source = path.resolve(source);
    dest = path.resolve(dest);

    //make sure we have a valid source module
    this.validateSource(source);

    //make sure we have a valid dest module
    this.validateDest(dest);

    console.log(chalk.cyan(':: copying module from: ' + chalk.white(source) + ' to ' + chalk.white(dest)));
    //console.log(chalk.cyan(':: source module file: ' + chalk.white(this.moduleFilePath(source))));

    var oldModuleName = path.basename(source);
    var moduleName = path.basename(dest);

    var options = {};

    //setup file names to change
    options.rename = {};
    options.rename[oldModuleName] = moduleName;

    //setup words to replace in source
    options.replace = [];
    options.replace.push([Case.camel(oldModuleName), Case.camel(moduleName)]);
    options.replace.push([Case.title(oldModuleName), Case.title(moduleName)]);
    options.replace.push([Case.kebab(oldModuleName), Case.kebab(moduleName)]);

    //use source as a template and generate new files
    this.cli.generate
      .source(source + '/**/*')
      .options(options)
      .dest(dest)
      .then(function() {

        var parentModulePath = self.cli.reflect.findParentModule(dest);

        self.cli.refactor.addModuleImport({
          identifier: Case.camel(moduleName),
          child: path.resolve(dest + '/' + Case.kebab(moduleName) +'.module.js'),
          parent: parentModulePath
        });

        self.cli.refactor.addAngularDependency({
          identifier: Case.kebab(moduleName),
          module: parentModulePath
        });

        console.log(chalk.yellow('\nPlease carefully examine all changes before you commit!\n'));
        
      });

  }
});