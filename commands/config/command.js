var Command = require('../../lib/command');
var inquirer = require('inquirer');

module.exports = Command.extend({

  init: function() {
    this._super.apply(this, arguments);

    this.description = 'Configure User & Project level settings.';
    this.category = 'other';
    this.options = '';
    this.order = 15;
    this.questions = [];

    //todo: read current config

    this.loadQuestions();

  },

  loadQuestions: function() {

    //add question to enable/disable features
    this.questions.push({
      type: 'checkbox',
      name: 'features',
      message: 'Enable features?',
      choices: [
        { name: 'Move', value: 'move' },
        { name: 'Copy', value: 'copy' }
      ]
    });

  },

  run: function() {

    inquirer.prompt(this.questions)
      .then(function() {

        //todo: write json file

      }.bind(this));

  }
});
