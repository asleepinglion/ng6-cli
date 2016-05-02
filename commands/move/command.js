var fs = require('fs');
var path = require('path');
var Command = require('../../lib/command');
var chalk = require('chalk');
var inquirer = require('inquirer');

module.exports = Command.extend({

  init: function() {

    this._super.apply(this, arguments);

    this.description = "Move or rename a module.";
    this.options = '';
    this.order = 13;

  },

  run: function(source, dest) {

    console.log("This command will be available shortly.");
    console.log("");

    /*

    if( source && dest ) {

      inquirer.prompt([
        {
          type: 'confirm',
          name: 'confirmed',
          message: 'Move ' + chalk.cyan(path.resolve(source)) + ' to ' + chalk.cyan(path.resolve(dest)) + '?',
          default: function() {
            return true;
          }
        }
      ]).then(function(confirmation) {

        if( confirmation.confirmed ) {
          this.cli.refactor.move(source,dest);
        } else {
          console.log(chalk.white("\nMove cancelled.\n"));
        }

      });

    } else {

      var questions = [
        {
          type: 'input',
          name: 'source',
          message: "Source:",
          default: function () {
            return source || path.resolve('.');
          }
        },
        {
          type: 'input',
          name: 'dest',
          message: 'Destination:',
          filter: function(value) {
            return path.resolve(value);
          }
        }
      ];

      inquirer.prompt(questions).then(function(answers) {

        if( !fs.existsSync(path.resolve(answers.source)) ) {
          console.log(chalk.white("\nThe source directory provided does not exist.\n"));
          return;
        }

        if( fs.existsSync(path.resolve(answers.dest)) ) {
          console.log(chalk.white("\nThe destination directory already exists.\n"));
          return;
        }

        inquirer.prompt([
          {
            type: 'confirm',
            name: 'confirmed',
            message: 'Are you sure you want to move and refactor this module?',
            default: function() {
              return true;
            }
          }
        ]).then(function(confirmation) {

          if( confirmation.confirmed ) {
            self.cli.refactor.move(path.resolve(answers.source), path.resolve(answers.dest));
          } else {
            console.log(chalk.white("\nMove cancelled.\n"));
          }

        });

      });
    }

    */

  }
});