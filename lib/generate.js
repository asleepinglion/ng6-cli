var fs = require('fs');
var path = require('path');
var BaseClass = require('ouro-base');
var chalk = require('chalk');
var _ = require('lodash');
var Case = require('case');

var Promise = require('bluebird');

var gulp = require('gulp');
var rename = require('gulp-rename');
var template = require('gulp-template');
var install = require('gulp-install');

//todo: improve current approach to providing different casing for context variables, e.g. perhaps handlebar filters

module.exports = BaseClass.extend({

  init: function(cli) {
    this.cli = cli;
    this.templates = cli.templates;
    this.filemaps = {
      "gitignore": ".gitignore"
    };
  },

  createApp: function(template, name, destination) {

    var self = this;

    console.log(chalk.cyan(':: creating new app:'), chalk.white(name) + chalk.gray(' ('+path.resolve(destination)+')'));

    if( this.templates.get('app', template) ) {

      this.template('app', template)
        .context({appName: name})
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

    console.log(chalk.cyan(':: creating new module:'), chalk.white(name) + chalk.gray(' ('+path.relative(this.cli.reflect.projectRoot(), destination)+'/'+name+'.module.js)'));

    var self = this;

    this.template('module', 'default')
      .options({rename: name})
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

    this.template(type, template)
      .options({rename: name})
      .context({moduleName: this.cli.reflect.getModuleName(destination), name: name, "name_camel": Case.camel(name), "name_camel": Case.title(name)})
      .dest(destination)
      .then(function () {

        var identifier = name;
        var parentModulePath = self.cli.reflect.findParentModule(path.resolve(destination));

        //determine whether importing module or specific artifact
        var importType = type;
        if( type === 'component' ) {
          importType = 'module';
        } else if( type === 'directive' && template === 'element' ) {
          importType = 'module';
        }

        var modulePath = path.relative(self.cli.reflect.projectRoot(), destination) + '/' +name +'.'+importType+'.js';
        console.log(chalk.cyan(':: creating new ' + type + ': '), chalk.white(name) + chalk.gray(' (' + modulePath + ')'));

        //add service suffix if not set
        if( type === 'service' ) {
          identifier = Case.pascal(identifier);
          if( identifier.substr(identifier.length-'service'.length, identifier.length) !== 'Service' ) {
            identifier += 'Service';
          }
        }

        self.cli.refactor.addModuleImport({
          identifier: identifier,
          child: path.resolve(destination + '/' + name+'.' + importType + '.js'),
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

  source: function(sourcePath) {

    return {
      cli: this.cli,
      templates: this.templates,
      context: this.context,
      options: this.options,
      config: {},
      dest: this.dest,
      filemaps: this.filemaps,
      sourcePath: sourcePath
    };

  },

  template: function(type, templateName) {

    return this.source(this.templates.get(type, templateName).templatePath + '/template/**/*');
  },
  
  context: function(context) {
    this.context = context;
    return this;
  },

  options: function(options) {
    
    this.config = options;
    return this;

  },
  
  dest: function(destination) {

    var self = this;

    return new Promise(function(resolve, reject) {

      if( self.cli.isEnabled('debug') ) {
        console.log(chalk.gray(':: source:'), chalk.white(self.sourcePath));
        console.log(chalk.gray(':: destination:'), chalk.white(destination));
      }

      var stream = gulp.src(self.sourcePath, { dot: true })
        .pipe(rename(function(path) {

          // Rename files based on the mapping in this.filemaps (defined in init)
          if(self.filemaps[path.basename]) {
            path.basename = self.filemaps[path.basename];
          }

          if( self.config.rename ) {

            var basename = path.basename.split('.');

            if (basename.shift() === 'name') {

              basename.unshift(self.config.rename);

              if (self.cli.isEnabled('debug')) {
                console.log(chalk.gray(':: renaming file:'), chalk.white(basename.join('.') + path.extname));
              }

              path.basename = basename.join('.');
            }
          }

        }))
        .pipe(template(self.context))
        .pipe(gulp.dest(destination));

      stream.on('end', function() {
        resolve();
      });

      stream.on('error', function(err) {
        reject(err);
      });

    });
  }

});
