var fs = require('fs');
var path = require('path');
var chalk = require('chalk');
var Command = require('../../lib/command');

module.exports = Command.extend({

  init: function() {

    this._super.apply(this, arguments);

    this.templates = this.cli.templates;

    this.description = 'Scaffold a new app, component, service, command, or template.';
    this.category = 'scaffold';
    this.options = '[type] [name]';
    this.order = 4;

  },

  checkExists: function(type, destination) {
    if( fs.existsSync(destination) && !this.cli.request.isEnabled('force')) {
      if( type === 'app' ) {
        if( fs.readdirSync(destination).length > 0 ) {
          console.log('');
          console.log(chalk.white('An ' + chalk.cyan(type) + ' can only be created in an empty directory.'));
          console.log(chalk.white('Use the ') + chalk.cyan('--force') + chalk.white(' option to overwrite.'));
          console.log('');
          process.exit(1);
        }
      } else {
        console.log('');
        console.log(chalk.white('A ' + chalk.cyan(type) + ' already exists at this path.'));
        console.log(chalk.white('Use the ') + chalk.cyan('--force') + chalk.white(' option to overwrite.'));
        console.log('');
        process.exit(1);
      }
    }
  },

  run: function(type, name, destination) {

    var self = this;

    //todo: use inquirer to ask questions if type/name are not passed via arguments.
    if( !type || !name ) {
      return this.cli.commands.run('help', ['new']);
    } else {

      //select type & template based on command line args & options
      var template = this.cli.reflect.getTemplate(type);
      type = this.cli.reflect.getType(type);

      if( !this.cli.templates.get(type, template) ) {
        console.log('');
        console.log(chalk.white('The ' + chalk.cyan(type + ':' + template) + ' template is not currently available.'));
        console.log(chalk.white('To see a list of available templates type:'), chalk.cyan(this.cli.bin+' list templates'));
        console.log('');
        process.exit(1);
      }

      //determine which generation method to execute based on the type
      if( type === 'app' ) {

        destination = this.cli.reflect.getNewAppPath(name);

        if( name === '.' ) {
          name = path.basename(destination);
        }

        this.checkExists(type, destination);
        this.cli.generate.createApp(template, name, destination);

      } else if( type === 'library' ) {

        destination = this.cli.reflect.getNewAppPath(name);

        if( name === '.' ) {
          name = path.basename(destination);
        }

        this.checkExists(type, destination);
        this.cli.generate.createLibrary(template, name, destination);

      } else if( type === 'module' ) {

        destination = this.cli.reflect.getNewModulePath(type, name, destination);
        this.checkExists(type, destination);
        this.cli.generate.createModule(name, destination);

      } else if( type === 'template' ) {

        //todo: generation shouldn't happen if template already exists
        this.cli.generate.createTemplate(name);

      } else if( type === 'command' ) {

        //todo: generation shouldn't happen if command already exists
        this.cli.generate.createCommand(name);

      } else {

        destination = this.cli.reflect.getNewArtifactPath(type, template, name, destination);

        this.checkExists(type, destination);

        //if this is the first artifact of this type at the destination path
        //then create a new module and link the module to it's parent.
        //otherwise just create the artifact.
        if( !fs.existsSync(path.resolve(destination + '/../')) ) {

          var moduleName = type;

          //views are the same as components under the hood, but its cleaner to separate them in the structure
          if( this.cli.getOption('viewSeparation') && this.cli.getOption('v') && type === 'component' ) {
            moduleName = 'view';
          }

          //the submodule name is based on the type & parent module name
          moduleName = this.cli.reflect.getSubModuleName(moduleName, destination);

          //nested artifacts can make projects messy
          if( !this.cli.getOption('nestedArtifacts') && new RegExp(["components/", "views/", "directives/", "filters/", "providers/", "services/"].join("|"), 'gi').test(process.cwd()) ) {
            console.log(chalk.white('In order to keep your code flat and easy to maintain, nested artifacts are disabled.'));
            console.log(chalk.white('Instead we recommend you create a ' + chalk.cyan('module') + ' at a higher level to organize your projects & libraries.'));
            console.log('');
            console.log(chalk.white('You can override this behavior by setting the ') + chalk.cyan('nestedArtifacts') + chalk.white(' configuration option to ') + chalk.cyan("true") + chalk.white("."));
            process.exit(1);
          }

          this.cli.generate.createModule(moduleName, path.resolve(destination + '/../'), function() {
            self.cli.generate.createArtifact(type, template, name, destination);
          });


        } else {
          this.cli.generate.createArtifact(type, template, name, destination);
        }

      }
    }

  }

});
