var fs = require('fs');
var path = require('path');
var BaseClass = require('ouro-base');
var chalk = require('chalk');

module.exports = BaseClass.extend({

  init: function(cli) {

    this.cli = cli;

    this.templates = {};
    this.paths = [];
  },

  load: function(searchPath) {

    //maintain reference to self
    var self = this;

    if (fs.existsSync(searchPath) && this.paths.indexOf(searchPath) === -1 ) {

      //keep track of searched paths
      this.paths.push(searchPath);

      if( this.cli.isEnabled('debug') ) {
        console.log(chalk.gray(':: loading templates:', searchPath));
      }

      //get list of files in search path
      var templateTypes = fs.readdirSync(searchPath);

      //loop through list of files
      templateTypes.map(function (templateType) {

        var templateTypePath = path.resolve(searchPath + '/' + templateType);

        if (fs.existsSync(templateTypePath) && fs.lstatSync(templateTypePath).isDirectory()) {

          var templates = fs.readdirSync(templateTypePath);

          templates.map(function(templateName) {

            var templatePath = path.resolve(templateTypePath + '/' + templateName);

            if( !self.exists(templateType, templateName) && fs.existsSync(path.resolve(templatePath + '/template')) && fs.existsSync(path.resolve(templatePath + '/template.js')) ) {

              if( !self.templates[templateType] ) {
                self.templates[templateType] = {};
              }

              if (self.cli.isEnabled('debug')) {
                console.log(chalk.gray(':: loading template:', templateType + ':' + templateName));
              }

              var Template = require(path.resolve(templatePath + '/template.js'));
              self.templates[templateType][templateName] = new Template(self.cli);
              self.templates[templateType][templateName].templatePath = templatePath;
              self.templates[templateType][templateName].name = templateName;
            }

          });

        }


      });
    }
  },

  exists: function(type, templateName) {
    if( this.templates[type] && this.templates[type][templateName] ) {
      return true;
    } else {
      return false;
    }
  },

  types: function() {
    return Object.keys(this.templates);
  },

  byType: function(type) {
    return this.templates[type];
  },

  get: function(type, templateName) {

    if( this.templates[type] && this.templates[type][templateName] ) {
      return this.templates[type][templateName];
    } else {

      console.log("");
      console.log(chalk.white('The ' + chalk.cyan(type + ':' + templateName) + ' template is not currently available.'));
      console.log(chalk.white('To see a list of available templates type:'), chalk.cyan(this.cli.bin+' list templates'));
      console.log("");


      return false;
    }
  }
});