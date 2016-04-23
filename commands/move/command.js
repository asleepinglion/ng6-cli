var fs = require('fs');
var path = require('path');
var Command = require('../../lib/command');
//var chalk = require('chalk');

module.exports = Command.extend({

  init: function() {

    this._super.apply(this, arguments);

    this.description = "Move or rename a module.";
    this.options = '';
    this.order = 13;

  },

  run: function() {

    console.log("This command will be available shortly.");
    console.log("");

  }
});