var chalk = require('chalk');
var Template = require('../../../lib/template');
var shell = require('shelljs');
var spawn = require('cross-spawn');

module.exports = Template.extend({

  init: function() {
    this._super.apply(this, arguments);
    this.description = 'An Angular application based on Angular 1.5, ES6, and Webpack.';
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

  onSuccess: function(installed, name) {

    console.log('');
    console.log(chalk.white('First ' + chalk.cyan('cd ' + name) + ' to enter the project root.'));

    if( !installed ) {
      console.log(chalk.white('Make sure to run ' + chalk.cyan('npm install') + ' or ' + chalk.cyan('yarn') + ' to install dependencies!'));
    }

    console.log(chalk.white('Then run ' + chalk.cyan(this.cli.bin + ' serve') + ' to view the project locally.'));
    console.log('');
  },

  done: function(name, destination) {

    if( this.cli.request.getOption('install') || this.cli.request.getOption('i') ) {

      if( !shell.which('npm') || !shell.which('yarn') ) {
        console.log();
        console.log(chalk.white('The application was created, but could not find ' + chalk.cyan('npm') + ' or ' + chalk.cyan('yarn') + ' to install dependencies!'));
        console.log();
        return;
      }

      console.log(chalk.cyan(':: installing dependencies'), chalk.gray(' (this make take a few minutes)'));
      console.log();

      var installCommand = shell.which('yarn') ? 'yarn' : 'npm install';

      shell.cd(destination);

      spawn.sync(installCommand, ['install'], { stdio: 'inherit' });

      this.onSuccess(true, name);

    } else {

      this.onSuccess(false, name);

    }
  }
});
