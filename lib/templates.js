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

  loadTemplate: function(templateType, templateName, templatePath) {

    var self = this;

    //if the template has already been loaded, keep track of parent template paths for extending templates
    if (self.exists(templateType, templateName) && self.get(templateType, templateName).extend) {

      if (self.cli.isEnabled('debug')) {
        console.log(chalk.gray(':: loading parent template:', templateType + ':' + templateName));
      }

      var childTemplatePath = self.templates[templateType][templateName].templatePath;

      if (_.isArray(childTemplatePath)) {
        self.templates[templateType][templateName].templatePath.unshift(templatePath);
      } else {
        self.templates[templateType][templateName].templatePath = [templatePath, childTemplatePath];
      }


    } else if (!self.exists(templateType, templateName)) {

      if (self.cli.isEnabled('debug')) {
        console.log(chalk.gray(':: loading template:', templateType + ':' + templateName));
      }

      if (!self.templates[templateType]) {
        self.templates[templateType] = {};
      }

      var Template = require(path.resolve(templatePath + '/template.js'));
      self.templates[templateType][templateName] = new Template(self.cli);
      self.templates[templateType][templateName].templatePath = templatePath;
      self.templates[templateType][templateName].name = templateName;

    }

  },

  load: function(searchPath) {

    //maintain reference to self
    var self = this;

    //get template map from configuration
    var templateMap = self.cli.config.get('templates');

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

            if( fs.lstatSync(templatePath).isDirectory() ) {

              //make sure the template has at least a template folder and template.js
              if (fs.existsSync(path.resolve(templatePath + '/template')) && fs.existsSync(path.resolve(templatePath + '/template.js'))) {

                self.loadTemplate(templateType, templateName, templatePath);

              } else {

                //expect a list of folders by version
                var versions = fs.readdirSync(templatePath).filter((folder) => {
                  return fs.lstatSync(path.resolve(templatePath, folder)).isDirectory();
                });

                if( versions.length > 0 ) {

                  //sort the list of versions highest to lowest
                  versions = versions.sort().reverse();

                  //get the latest version
                  var version = versions[0];

                  if (self.cli.isEnabled('debug')) {
                    console.log(chalk.gray(':: selecting template version:'), chalk.white(templateType,templateName,version));
                  }

                  //use alternate version if specified in config
                  if( templateMap ) {
                    if( templateMap[templateType] && templateMap[templateType][templateName] ) {

                      var mappedVersion = version;

                      if( _.isString(templateMap[templateType][templateName]) ) {
                        mappedVersion = templateMap[templateType][templateName];
                      } else if( _.isObject(templateMap[templateType][templateName]) ) {
                        if( templateMap[templateType][templateName].version ) {
                          mappedVersion = templateMap[templateType][templateName].version;
                        }
                      }

                      if( versions.indexOf(mappedVersion) > -1 ) {
                        version = mappedVersion;
                      }
                    }
                  }

                  //use version for template path
                  templatePath = path.resolve(templatePath, version);

                  self.loadTemplate(templateType, templateName, templatePath);
                }

              }
            }

          });

        }

      });
    }

    //apply aliases using the template map
    if( templateMap ) {
      Object.keys(templateMap).map((templateType) => {
        Object.keys(templateMap[templateType]).map((templateName) => {

          //create shortcut reference to individual template map
          var map = templateMap[templateType][templateName];

          //create alias as long as the specified template exists
           if( _.isObject(map) ) {
             if( map.template ) {
               if( this.exists(templateType, map.template) ) {
                 this.templates[templateType][templateName] = this.templates[templateType][map.template];
               }
             }
           }
        });
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