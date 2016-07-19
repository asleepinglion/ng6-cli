var fs = require('fs');
var path = require('path');
var BaseClass = require('ouro-base');
var chalk = require('chalk');
var _ = require('lodash');
var Case = require('case');
var merge = require('deepmerge');

var Promise = require('bluebird');

var gulp = require('gulp');
var rename = require('gulp-rename');
//var template = require('gulp-template');
var ejs = require('gulp-ejs');
var install = require('gulp-install');
var batchReplace = require('gulp-batch-replace');

//todo: replace augmented context variables (name.camel, name_title, etc) with methods using EJS in the templates

module.exports = BaseClass.extend({

  init: function(cli) {
    this.cli = cli;
    this.templates = cli.templates;
  },

  createApp: function(template, name, destination) {

    var self = this;

    console.log(chalk.cyan(':: creating new app:'), chalk.white(name) + chalk.gray(' ('+path.resolve(destination)+')'));

    if( this.templates.get('app', template) ) {

      this.template('app', template)
        .context({name: name})
        .dest(destination)
        .then(function() {
          if(self.templates.get('app', template).done ) {
            self.templates.get('app', template).done(name, destination);
          }
        });

    } else {
      return false;
    }

  },

  createModule: function(name, destination, callback) {

    console.log(chalk.cyan(':: creating new module:'), chalk.white(name) + chalk.gray(' ('+path.normalize(path.relative(this.cli.reflect.projectRoot(), destination)+'/'+name+'.module.js)')));

    var self = this;

    this.template('module', 'default')
      .options({rename: {name: name}})
      .context({moduleName: this.cli.reflect.getModuleName(destination), name: name, "name.camel": Case.camel(name)})
      .dest(destination)
      .then(function() {

        var parentModulePath = self.cli.reflect.findParentModule(destination);

        self.cli.refactor.addModuleImport({
          identifier: name,
          child: path.resolve(destination + '/' + name+'.module.js'),
          parent: parentModulePath
        });

        self.cli.refactor.addAngularDependency({
          identifier: name,
          module: parentModulePath
        });

        if( callback ) {
          callback.apply(self, []);
        }
      });

  },

  createArtifact: function(type, template, name, destination, callback) {

    var self = this;

    var artifactName = Case.camel(name);
    var pathName = Case.kebab(name);

    this.template(type, template)
      .options({rename: {name: pathName}})
      .context({moduleName: this.cli.reflect.getModuleName(destination), name: pathName, "name_camel": Case.camel(name), "name_title": Case.title(name)})
      .dest(destination)
      .then(function () {

        var identifier = artifactName;
        var parentModulePath = self.cli.reflect.findParentModule(path.resolve(destination));

        //determine whether importing module or specific artifact
        var importType = type;
        if( type === 'component' ) {
          importType = 'module';
        } else if( type === 'directive' && template === 'element' ) {
          importType = 'module';
        }

        //add service suffix if not set
        if( type === 'service' ) {
          identifier = Case.pascal(identifier);
          if( identifier.substr(identifier.length-'service'.length, identifier.length) !== 'Service' ) {
            identifier += 'Service';
          }
        }

        var modulePath = path.normalize(path.relative(self.cli.reflect.projectRoot(), destination) + '/' + pathName +'.' + importType+'.js');
        console.log(chalk.cyan(':: creating new ' + type + ': '), chalk.white(identifier) + chalk.gray(' (' + modulePath + ')'));

        self.cli.refactor.addModuleImport({
          identifier: identifier,
          child: path.resolve(destination + '/' + pathName + '.' + importType + '.js'),
          parent: parentModulePath
        });

        if( importType === 'module' ) {

          self.cli.refactor.addAngularDependency({
            identifier: name,
            module: parentModulePath
          });

        } else {

          self.cli.refactor.addAngularDefinition({
            name: identifier,
            type: type,
            module: parentModulePath
          });

        }

        if(self.templates.get(type, template).done ) {
          self.templates.get(type, template).done(name, destination);
        }

        if( callback ) {
          callback.apply(self, []);
        }
      });

  },

  createTemplate: function(name) {

    var self = this;

    var type = this.cli.reflect.getType(name);
    var template = this.cli.reflect.getTemplate(name);

    var destination = path.resolve(this.cli.reflect.projectRoot() + '/templates/' + type + '/' + template);

    console.log(chalk.cyan(':: creating new template: ' + chalk.white(name)));

    this.template('template', 'default')
      .context({name: name})
      .dest(destination)
      .then(function () {
        //done
      });

  },

  createCommand: function(name) {

    var self = this;

    var destination = path.resolve(this.cli.reflect.projectRoot() + '/commands/' + name);

    console.log(chalk.cyan(':: creating new command: ' + chalk.white(name)));

    this.template('command', 'default')
      .context({name: name})
      .dest(destination)
      .then(function () {
        //done
      });

  },

  template: function(type, templateName) {

    var template = this.templates.get(type, templateName);

    if(template) {

      var templatePath = [];

      if( _.isArray(template.templatePath) ) {
        templatePath = template.templatePath.map(function(path) {
          return path + '/template/**/*';
        });
      } else {
        templatePath.push(template.templatePath  + '/template/**/*');
      }

      return this.source(templatePath, template);

    } else {

      return false;

    }
  },

  source: function(sourcePath, template) {

    var worker = {

      //essential references
      cli: this.cli,
      templates: this.templates,
      template: template,

      //populate data with cli config and request options
      data: {
        cli: {
          config: this.cli.config.config,
          request: this.cli.request.request
        }
      },

      //setup source path(s)
      sourcePath: [sourcePath],

      //setup template configuration
      config: {replace: [], rename: {}},

      //expose methods available to this generation task
      context: this.context,
      options: this.options,
      dest: this.dest,
      generate: this.generate

    };

    if( template.config ) {
      worker.config = merge(worker.config, template.config());
    }

    return worker;

  },
  
  context: function(context) {
    this.data = merge(this.data, context);
    return this;
  },

  options: function(options) {
    
    this.config = merge(this.config, options);

    //make sure we always have at least an empty array
    if( !this.config.replace ) {
      this.config.replace = [];
    }

    //make sure we always have at least an empty array
    if( !this.config.rename ) {
      this.config.rename = {};
    }
    
    return this;

  },
  
  dest: function(destination) {

    var self = this;
    self.destination = destination;

    return new Promise(function(resolve, reject) {

      if (self.cli.isEnabled('debug')) {
        console.log(chalk.gray(':: source:'), chalk.white(self.sourcePath));
        console.log(chalk.gray(':: destination:'), chalk.white(destination));
      }

      Promise.each(self.sourcePath, function(sourcePath) {
        return self.generate.apply(self, [sourcePath]);
      })
        .then(function() {
          resolve();
        })
        .catch(function(err) {
          reject(err);
        });

    });
  },

  generate: function(sourcePath) {

    var self = this;

    return new Promise(function(resolve, reject) {

      if (self.cli.isEnabled('debug')) {
        console.log(chalk.gray(':: generating template:'), chalk.white(sourcePath));
      }

      var stream = gulp.src(sourcePath, {dot: true})
        .pipe(rename(function (path) {

          //rename, if the file is specified in the template configuration
          var dir = self.config.rename[path.dirname];
          if( dir ) {

            var file = dir[path.basename + path.extname];
            if( file ) {

              if( typeof file === 'object' ) {

                if (file.basename) {
                  path.basename = file.basename;
                }

                if (file.extname) {
                  path.extname = file.extname;
                }

              } else {

                file = file.split('.');
                path.basename = file[0];
                if( file[1] ) {
                  path.extname = '.' + file[1];
                }

              }
            }
          }

          //replace the keyword 'name.' at the beginning of a file with the artifact name
          if( path.basename.split('.')[0] === 'name' ) {

            var basename = path.basename.split('.');

            var newName = Case.kebab(self.data.name);

            basename.shift();
            basename.unshift(newName);

            if (self.cli.isEnabled('debug')) {
              console.log(chalk.gray(':: renaming file:'), chalk.white(basename.join('.') + path.extname));
            }

            path.basename = basename.join('.');

          }

        }))
        .pipe(batchReplace(self.config.replace))
        .pipe(ejs(self.data))
        .pipe(gulp.dest(self.destination));

      stream.on('end', function () {
        resolve({});
      });

      stream.on('error', function (err) {
        reject(err);
      });

    });
  }

});