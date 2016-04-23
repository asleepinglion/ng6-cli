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

module.exports = BaseClass.extend({

  init: function(cli) {
    this.cli = cli;
    this.templates = cli.templates;
    this.filemaps = {
      "gitignore": ".gitignore"
    };
  },
  
  app: function(template, name, destination) {

    console.log(chalk.cyan(':: creating new application: ' + chalk.white(name)));

    var self = this;

    if( name === '.' ) {
      name = path.basename(process.cwd());
      destination = '.';
    }

    if( destination ) {
      if( destination === '.' ) {
        path.resolve(process.cwd());
      } else {
        destination = path.resolve(destination);
      }
    } else {
      destination = path.resolve(process.cwd() + '/' + name);
    }

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

  artifact: function(type, template, name, destination) {
    
    var self = this;
    var cwd = process.cwd();

    var projectRoot = this.cli.reflect.projectRoot();
    if (!projectRoot) {
      console.log(chalk.white("Make sure you are inside a project before creating a new " + type + "!"));
      console.log("");
      return;
    }

    if( cwd === path.resolve(projectRoot + '/shared_modules') ) {
      console.log(chalk.white("You cannot create an artifact directly in the shared modules folder."));
      console.log("");
      return;
    }

    //determine the destination
    if (!destination) {
      if (projectRoot !== cwd && (cwd.indexOf(path.resolve(projectRoot + '/components')) !== -1 || cwd.indexOf(path.resolve(projectRoot + '/shared_modules')) !== -1) ) {
        if (path.basename(cwd) !== type+'s') {
          destination = path.resolve(cwd + '/' + type + 's/' + name);
        } else {
          destination = path.resolve(cwd + '/' + name);
        }
      } else {
        destination = path.resolve(projectRoot + '/' + type + 's/' + name);
      }
    }

    //if this is the first artifact of this type at the destination path
    //then create a new module and link the module to it's parent.
    //otherwise just create the artifact.
    if( !fs.existsSync(path.resolve(destination + '/../')) ) {

      var parentModule = this.cli.reflect.findParentModule(path.resolve(destination + '/../'));
      var parentModuleName = '';

      if( parentModule ) {
        parentModuleName = path.basename(path.dirname(parentModule));

        if (parentModuleName === 'app') {
          parentModuleName = '';
        } else {
          parentModuleName += '.';
        }
      }

      this.createModule(parentModuleName + type+'s', path.resolve(destination + '/../'), function() {
        self.createArtifact(type, template, name, destination);
      });
      
    } else {
      this.createArtifact(type, template, name, destination);
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
      .context({moduleName: this.cli.reflect.getModuleName(destination), name: name, "name_camel": Case.camel(name)})
      .dest(destination)
      .then(function () {

        var identifier = name;
        var parentModulePath = self.cli.reflect.findParentModule(path.resolve(destination));
        var importType = (type === 'component' ) ? 'module' : type;


        console.log(chalk.cyan(':: creating new ' + type + ': '), chalk.white(name) + chalk.gray(' ('+path.relative(self.cli.reflect.projectRoot(), destination)+'.'+importType+'.js)'));

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

        if( type === 'component' ) {

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
