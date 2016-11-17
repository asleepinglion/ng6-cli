var chalk = require('chalk');
var Template = require('../../../lib/template');
var shell = require('shelljs');
var Spinner = require('cli-spinner').Spinner;

module.exports = Template.extend({

  init: function() {
    this._super.apply(this, arguments);
    this.description = 'An Ionic application based on Angular 1.5, ES6, and Webpack.';
  },

  config: function() {

    var config = {
      rename: {
        '.': {
          'gitignore': '.gitignore'
        },
        'app': {}
      }
    };

    if( !this.cli.getOption('cssModules') ) {
      config.rename.app['app.module.scss'] = { basename: 'app.component' };
    }

    return config;

  },

  onSuccess: function(installed) {
    console.log('');
    console.log(chalk.white('First ' + chalk.cyan('cd ' + this.name) + ' to enter the project root.'));

    if( !installed ) {
      console.log(chalk.white('Make sure to run ' + chalk.cyan('npm install') + ' to install dependencies!'));
    }

    console.log(chalk.white('Then run ' + chalk.cyan(this.cli.bin + ' serve') + ' to view the project locally.'));
    console.log('');
    console.log('To add cordova platforms use: ' + chalk.cyan('cordova platform add ' + chalk.gray('[platform]')));
    console.log('To add cordova plugins use: ' + chalk.cyan('cordova plugin add ' + chalk.gray('[plugin]')));
    console.log('');
  },

  done: function(name, destination) {

    this.name = name;
    this.destination = destination;

    var self = this;

    if( (self.cli.request.getOption('install') || self.cli.request.getOption('i')) ) {

      if( !shell.which('npm') ) {
        console.log('');
        console.log(chalk.white('The application was created, but could not find ' + chalk.cyan('npm') + ' to install dependencies!'));
        console.log('');
        return;
      }

      console.log(chalk.cyan(':: installing dependencies'), chalk.gray(' (this make take a few minutes)'));
      console.log();

      var spinner = new Spinner(chalk.cyan('%s'));
      spinner.start();

      shell.cd(destination);

      shell.exec('npm install', function(code, output) {

        spinner.stop();
        console.log(output);

        self.onSuccess(true);

      });

    } else {

      self.onSuccess();

    }

  }
});
