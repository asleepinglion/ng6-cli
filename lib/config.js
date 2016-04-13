var fs = require('fs');
var path = require('path');
var BaseClass = require('ouro-base');
var merge = require('deepmerge');

module.exports = BaseClass.extend({

  init: function (cli, config) {

    this.cli = cli;
    this.config = config || {};

    this.loadProjectConfig();
    this.loadUserConfig();
  },
  
  loadProjectConfig: function() {

    var projectConfigFile = path.resolve(this.cli.reflect.projectRoot() + '/' + this.config.configFile);

    //load project configuration if exists
    if (this.config.configFile && fs.existsSync(projectConfigFile)) {

      //load & parse user config file
      var projectConfig = JSON.parse(fs.readFileSync(projectConfigFile));

      //merge user options
      this.config = merge(this.config, projectConfig);
    }
    
  },

  loadUserConfig: function () {

    var userConfigFile = path.resolve(this.cli.reflect.userHome() + '/' + this.config.configFile);

    //load project configuration if exists
    if (this.config.configFile && fs.existsSync(userConfigFile)) {

      //load & parse user config file
      var userConfig = JSON.parse(fs.readFileSync(userConfigFile));

      //merge user options
      this.config = merge(this.config, userConfig);
    }

  },

  isEnabled: function (option) {
    return (this.config[option]) ? true : false;
  },

  get: function (option) {
    return this.config[option];
  }

});