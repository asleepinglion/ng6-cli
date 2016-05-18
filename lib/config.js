var fs = require('fs');
var path = require('path');
var BaseClass = require('ouro-base');
var merge = require('deepmerge');

module.exports = BaseClass.extend({

  init: function (cli, config) {

    this.cli = cli;
    this.config = config || {};
  },

  load: function(configFile) {


    //load default configuration
    if( fs.existsSync(configFile)) {

      //load & parse user config file
      var config = JSON.parse(fs.readFileSync(configFile));

      //merge user options
      this.config = merge(this.config, config);
    }

  },

  isEnabled: function (option) {
    return (this.config[option]) ? true : false;
  },

  get: function (option) {
    return this.config[option];
  }

});