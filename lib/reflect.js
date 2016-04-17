var fs = require('fs');
var path = require('path');
var BaseClass = require('ouro-base');
var chalk = require('chalk');
var homedir = require('homedir');
var acorn = require('acorn');
var walk = require('acorn/dist/walk');

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

  getModuleName: function(componentPath, projectRoot) {

    var projectRoot = projectRoot || this.projectRoot();

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

  findParentModule: function (childPath, projectRoot) {

    var projectRoot = projectRoot || this.projectRoot();

    //return app module if were at the root
    if( childPath === projectRoot ) {
      return path.resolve(projectRoot + '/app/app.module.js');
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
        return path.resolve(projectRoot + '/app/app.module.js');
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
    var ast = acorn.parse(source, {sourceType: "module", ranges: true});

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
    var ast = acorn.parse(source, {sourceType: "module", ranges: true});

    var lastAngularDependency = false;
    var arrayExpressionStart = false;

    walk.simple(ast, {
      CallExpression: function(callExpression) {
        if( callExpression.callee.object.name === 'angular' && callExpression.callee.property.name === 'module' ) {
          walk.simple(callExpression, {
            ArrayExpression: function (arrayExpression) {

              //todo: check whether the identifier already exists

              if( arrayExpression.elements.length >  0 ) {
                lastAngularDependency = arrayExpression.elements[arrayExpression.elements.length - 1].end;
              } else {
                arrayExpressionStart = arrayExpression.start+1;
              }
            }
          });
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

    var source = fs.readFileSync(moduleFilePath);
    var ast = acorn.parse(source, {sourceType: "module", ranges: true});

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