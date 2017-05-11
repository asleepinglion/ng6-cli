var fs = require('fs');
var path = require('path');
var Command = require('../../lib/command');
var chalk = require('chalk');
var Case = require('case');
var trash = require('trash');

module.exports = Command.extend({

  init: function() {

    this._super.apply(this, arguments);
    this.description = 'Remove an artifact and it\'s references.';
    this.options = '';
    this.category = 'refactor';
    this.order = 16;

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

  run: function(source) {

    var self = this;

    //make sure we're passing in the source
    if( !source ) {
      console.log(chalk.white('\nYou must provide a source to remove a module.\n'));
      process.exit(1);
    }

    //resolve provided paths
    source = path.resolve(source);

    //make sure we have a valid source module
    this.validateSource(source);

    console.log(chalk.cyan(':: removing module from: ' + chalk.white(source)));
    //console.log(chalk.cyan(':: source module file: ' + chalk.white(this.moduleFilePath(source))));

    var moduleName = path.basename(source);
    
    var parentModulePath = self.cli.reflect.findParentModule(source);

    trash(source).then(()=> {
      this.cli.refactor.removeModuleImport({
        identifier: Case.camel(moduleName),
        parent: parentModulePath,
      });

      this.cli.refactor.removeAngularDependency({
        identifier: Case.kebab(moduleName),
        module: parentModulePath
      });
      console.log(chalk.yellow('\nPlease carefully examine all changes before you commit!\n'));
    }).catch(err => {
      console.log(chalk.red('Something bad happened!\n\n'));
      console.error(err);
    });

  }
});
