var fs = require('fs');
var path = require('path');
var Command = require('../../lib/command');
//var chalk = require('chalk');

module.exports = Command.extend({

  init: function() {

    this._super.apply(this, arguments);

    this.description = "Copy an artifact to a new location.";
    this.options = '';
    this.order = 12;

  },

  run: function() {

    console.log("This command will be available shortly.");
    console.log("");

  }
});