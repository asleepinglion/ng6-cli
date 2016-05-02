var fs = require('fs');
var path = require('path');
var BaseClass = require('ouro-base');
var chalk = require('chalk');

module.exports = BaseClass.extend({

  init: function (cli) {

    this.cli = cli;
    this.extend = false;
    this.description = "This template's description has not been set yet.";

  }

});