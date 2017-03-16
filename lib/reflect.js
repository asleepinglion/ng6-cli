var fs = require('fs');
var path = require('path');
var BaseClass = require('ouro-base');
var chalk = require('chalk');
var homedir = require('homedir');
var acorn = require('acorn');
var walk = require('acorn/dist/walk');
var Case = require('case');

// TODO: address inconsistent method names -- some have specific verbs, some just nouns.
// TODO: document class & class methods with jsdoc

module.exports = BaseClass.extend({

  init: function(cli) {
    this.cli = cli;
    this.cachedProjectRoot = false;
  },

  userHome: function() {
    return homedir();
  },

  projectRoot: function(searchPath) {

    if( this.cachedProjectRoot ) {
      return this.cachedProjectRoot;
    }

    searchPath = searchPath || process.cwd();

    var parentPath = '';

    if (fs.existsSync(path.resolve(searchPath + '/package.json'))) {
      var pkg = require(path.resolve(searchPath + '/package.json'));

      if (!pkg.component) {
        this.cachedProjectRoot = searchPath;
        return searchPath;
      } else {
        parentPath = path.resolve(searchPath + '/../');
        return this.projectRoot(parentPath);
      }
    } else {

      parentPath = path.resolve(searchPath + '/../');
      if (fs.existsSync(parentPath)) {
        return this.projectRoot(parentPath);
      } else {
        return false;
      }
    }
  },

  projectType: function(searchPath) {

    if( this.cachedProjectType ) {
      return this.cachedProjectType;
    }

    searchPath = searchPath || process.cwd();

    var parentPath = '';

    if (fs.existsSync(path.resolve(searchPath + '/package.json'))) {
      var pkg = require(path.resolve(searchPath + '/package.json'));

      if (!pkg.component) {
        if ( pkg.library || fs.existsSync(path.resolve(searchPath + '/library.module.js')) ) {
            this.cachedProjectType = 'library'
            return 'library';
        } else {
          this.cachedProjectType = 'app'
          return 'app';
        }

      } else {
        parentPath = path.resolve(searchPath + '/../');
        return this.projectType(parentPath);
      }
    } else {

      parentPath = path.resolve(searchPath + '/../');
      if (fs.existsSync(parentPath)) {
        return this.projectType(parentPath);
      } else {
        return false;
      }
    }
  },

  getTemplate: function(type) {

    var template = 'default';

    if( type.split(':').length === 2) {
      template = type.split(':')[1];
    }

    if( this.cli.request.options.t ) {
      template = this.cli.request.options.t;
    } else if( this.cli.request.options.template ) {
      template = this.cli.request.options.template;
    }

    return template;
  },

  getType: function(type) {

    if( type.split(':').length === 2) {
      type = type.split(':')[0];
    }

    return type;
  },

  getNewAppPath: function(name) {

    var destination = undefined;

    if( name === '.' ) {
      name = path.basename(process.cwd());
      destination = '.';
    }

    if( destination ) {
      if( destination === '.' ) {
        destination = path.resolve(process.cwd());
      } else {
        destination = path.resolve(destination);
      }
    } else {
      destination = path.resolve(process.cwd() + '/' + name);
    }

    return destination;

  },

  getNewArtifactPath: function(type, template, name, destination) {

    var cwd = process.cwd();

    //path names should all be kebab-cased
    name = Case.kebab(name);

    var projectRoot = this.cli.reflect.projectRoot();
    if (!projectRoot) {
      console.log(chalk.white('Make sure you are inside a project before creating a new ' + type + '!'));
      console.log('');
      return;
    }

    if( cwd === path.resolve(projectRoot + '/shared_modules') ) {
      console.log(chalk.white('You cannot create an artifact directly in the shared modules folder.'));
      console.log('');
      return;
    }

    //determine the destination
    if( destination ) {
      destination = path.resolve(destination);
    } else {
      destination = cwd;
    }

    // separate views as first class citizens
    if( this.cli.getOption('v') && type === 'component' ) {
      type = 'view';
    }

    if (path.basename(destination) !== type+'s') {
      destination = path.resolve(destination + '/' + type + 's/' + name);
    } else {
      destination = path.resolve(destination + '/' + name);
    }

    //can a view be created inside a component directory? no
    //can views be created inside other views? no
    //can other artifacts be created inside a view? no
    //can artifacts be created in something other than a module? no

    return destination;

  },

  getNewModulePath: function(type, name, destination) {

    var cwd = process.cwd();

    var projectRoot = this.cli.reflect.projectRoot();
    if (!projectRoot) {
      console.log(chalk.white('Make sure you are inside a project before creating a new ' + type + '!'));
      console.log('');
      return;
    }

    //determine the destination
    destination = path.resolve(cwd + '/' + name);

    return destination;

  },

  getModuleName: function(componentPath, projectRoot) {

    projectRoot = projectRoot || this.projectRoot();

    var modules = [];
    modules.push(path.basename(projectRoot));

    path
      .relative(projectRoot, componentPath)
      .split(path.sep)
      .map(function(pathPart) {
        modules.push(pathPart);
      });

    return modules.join('.');
  },

  getSubModuleName: function(type, destination) {

    var parentModule = this.findParentModule(path.resolve(destination + '/../'));
    var parentModuleName = '';

    if( parentModule ) {
      parentModuleName = path.basename(path.dirname(parentModule));

      if (parentModuleName === 'app') {
        parentModuleName = '';
      } else {
        parentModuleName += '-';
      }
    }

    return parentModuleName + type + 's';

  },

  findParentModule: function (childPath) {

    var projectRoot = this.projectRoot();
    var projectType = this.projectType();

    //return app module if were at the root
    if( childPath === projectRoot ) {

      if( projectType === 'library') {
        if( fs.existsSync(path.resolve(projectRoot + '/library.module.js')) ) {
          return path.resolve(projectRoot + '/library.module.js');
        } else {
          return false;
        }
      }

      if( fs.existsSync(path.resolve(projectRoot + '/app/app.module.js')) ) {
        return path.resolve(projectRoot + '/app/app.module.js');
      } else {
        return false;
      }
    }

    //the child path has to be within the project root
    if( childPath.indexOf(projectRoot) === -1 ) {
      return false;
    }

    //start the parent path search from the child path
    var parentPath = childPath;
    var parentModule = false;
    var keepSearching = true;

    while( keepSearching && projectRoot !== parentPath ) {

      //go up a directory
      parentPath = path.resolve(parentPath + '/../');

      //return app module if were at the root
      if( parentPath === projectRoot ) {
        keepSearching = false;

        if( projectType === 'library') {
          if( fs.existsSync(path.resolve(projectRoot + '/library.module.js'))) {
            return path.resolve(projectRoot + '/library.module.js');
          } else {
            return false;
          }
        }

        if( fs.existsSync(path.resolve(projectRoot + '/app/app.module.js'))) {
          return path.resolve(projectRoot + '/app/app.module.js');
        } else {
          return false;
        }
      }

      //loop through files in the parent dir
      fs.readdirSync(parentPath).map(function(file) {

        if( file.indexOf('.module.js') !== -1 ) {

          if( parentModule ) {

            //only one parent module should exist
            parentModule = false;
            keepSearching = false;

          } else {

            parentModule = path.resolve(parentPath + '/' + file);
            keepSearching = false;
          }

        }

      });
    }

    return parentModule;

  },

  findLastAngularDefinition: function(moduleFilePath) {

    var source = fs.readFileSync(moduleFilePath);
    var ast = acorn.parse(source, {sourceType: 'module', ranges: true});

    var lastAngularDefinition = false;
    var endOfAngularModuleDefinition = false;

    walk.simple(ast, {
      ExpressionStatement: function(expressionStatement) {
        walk.simple(expressionStatement, {
          CallExpression: function(callExpression) {
            if( callExpression.callee.object.name === 'module' ) {
              if( ['component', 'directive', 'service', 'filter'].indexOf(callExpression.callee.property.name) !== -1 ) {
                lastAngularDefinition = callExpression.end+1;
              }
            }
          }
        })
      }
    });

    if( !lastAngularDefinition ) {

      walk.simple(ast, {
        VariableDeclarator: function(variableDeclarator) {
          if( variableDeclarator.id.name === 'module' ) {
            walk.simple(variableDeclarator, {
              CallExpression: function(callExpression) {
                if( callExpression.callee.object.name === 'angular' && callExpression.callee.property.name === 'module' ) {
                  endOfAngularModuleDefinition = callExpression.end+1;
                }
              }
            })
          }
        }
      });

    }

    if( lastAngularDefinition ) {
      return {position: lastAngularDefinition, first: false};
    } else if( endOfAngularModuleDefinition ) {
      return {position: endOfAngularModuleDefinition, first: true};
    } else {
      return false;
    }

  },

  findLastAngularDependency: function(moduleFilePath) {

    var source = fs.readFileSync(moduleFilePath);
    var ast = acorn.parse(source, {sourceType: 'module', ranges: true});

    var lastAngularDependency = false;
    var arrayExpressionStart = false;

    walk.simple(ast, {
      CallExpression: function(callExpression) {

        if( callExpression.callee && callExpression.callee.object && callExpression.callee.property ) {

          if (callExpression.callee.object.name === 'angular' && callExpression.callee.property.name === 'module') {
            walk.simple(callExpression, {
              ArrayExpression: function (arrayExpression) {

                //todo: check whether the identifier already exists

                if (arrayExpression.elements.length > 0) {
                  lastAngularDependency = arrayExpression.elements[arrayExpression.elements.length - 1].end;
                } else {
                  arrayExpressionStart = arrayExpression.start + 1;
                }
              }
            });
          }
        }
      }
    });

    if( lastAngularDependency ) {
      return {position: lastAngularDependency, first: false};
    } else if( arrayExpressionStart ) {
      return {position: arrayExpressionStart, first: true};
    } else {
      return false;
    }

  },

  findLastImportStatement: function(moduleFilePath) {

    //todo: detect whether the import statement already exists

    if( !fs.existsSync(moduleFilePath) ) {
      return false;
    }

    var source = fs.readFileSync(moduleFilePath);
    var ast = acorn.parse(source, {sourceType: 'module', ranges: true});

    var lastImportNode = false;
    var lastImportLocation = 0;

    ast.body.map(function(node) {
      if( node.type === 'ImportDeclaration' ) {
        lastImportNode = node;
      }
    });

    if( lastImportNode ) {
      lastImportLocation = lastImportNode.end;
    }

    return lastImportLocation;

  },

});
