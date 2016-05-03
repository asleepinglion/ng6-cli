var fs = require('fs');
var path = require('path');
var BaseClass = require('ouro-base');
var chalk = require('chalk');
var _ = require('lodash');

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

      //loop through folders which should be named after each type (app, component, etc)
      templateTypes.map(function (templateType) {

        var templateTypePath = path.resolve(searchPath + '/' + templateType);

        if (fs.existsSync(templateTypePath) && fs.lstatSync(templateTypePath).isDirectory()) {

          var templates = fs.readdirSync(templateTypePath);

          //loop through folders which should be named after each template for this type (default, etc)
          templates.map(function(templateName) {

            var templatePath = path.resolve(templateTypePath + '/' + templateName);

            //make sure the template has at least a template folder and template.js
            if( fs.existsSync(path.resolve(templatePath + '/template')) && fs.existsSync(path.resolve(templatePath + '/template.js')) ) {

              //if the template has already been loaded, keep track of parent template paths for extending templates
              if( self.exists(templateType, templateName) && self.get(templateType, templateName).extend ) {

                if (self.cli.isEnabled('debug')) {
                  console.log(chalk.gray(':: loading parent template:', templateType + ':' + templateName));
                }

                var childTemplatePath = self.templates[templateType][templateName].templatePath;

                if( _.isArray(childTemplatePath) ) {
                  self.templates[templateType][templateName].templatePath.unshift(templatePath);
                } else {
                  self.templates[templateType][templateName].templatePath = [templatePath, childTemplatePath];
                }


              } else if( !self.exists(templateType, templateName) ) {

                if (self.cli.isEnabled('debug')) {
                  console.log(chalk.gray(':: loading template:', templateType + ':' + templateName));
                }

                if( !self.templates[templateType] ) {
                  self.templates[templateType] = {};
                }

                var Template = require(path.resolve(templatePath + '/template.js'));
                self.templates[templateType][templateName] = new Template(self.cli);
                self.templates[templateType][templateName].templatePath = templatePath;
                self.templates[templateType][templateName].name = templateName;

              }
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
      return false;
    }
  }
});