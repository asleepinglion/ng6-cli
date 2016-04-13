var fs = require('fs');
var path = require('path');
var BaseClass = require('ouro-base');
var acorn = require('acorn');
var walk = require('acorn/dist/walk');
var Case = require('case');
var util = require('util');
var chalk = require('chalk');

module.exports = BaseClass.extend({

  init: function(cli) {
    this.cli = cli;
  },

  /*
   * Defines a new angular artifact on an existing module.
   * @param {Object} options - An options object.
   * @param {String} options.name - The name of the new artifact.
   * @param {String} options.type - The type of the new artifact.
   * @param {String} options.module - The path to the module file.
   * @param {String} options.artifact - The path to the new artifact.
   */

  addAngularDefinition: function(options) {

    if( typeof options !== 'object' || !options.name || !options.type || !options.module  ) {
      return false;
    }

    console.log(chalk.cyan(':: adding angular definition: ' + chalk.white(options.name)));

    var location = this.findLastAngularDefinition(options.module);

    var identifier = Case.pascal(options.name);
    var artifactName = (['service'].indexOf(options.type) === -1 ) ? Case.camel(options.name) : Case.pascal(options.name);

    //create the angular definition statement
    var angularDefinition = "module." + options.type + "('" + artifactName + "', " + identifier  + ");"

    if( location.first ) {
      angularDefinition = "\n\n"+angularDefinition;
    } else {
      angularDefinition = "\n"+angularDefinition;
    }

    this.write(options.module, location.position, angularDefinition);

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

  /*
   * Add an angular dependency to a angular.module definition.
   * @param {Object} options - An options object.
   * @param {String} options.identifier - The identifier for an imported module.
   */

  addAngularDependency: function(options) {

    if( typeof options !== 'object' || !options.identifier || !options.module) {
      return false;
    }

    console.log(chalk.cyan(':: adding angular dependency: ' + chalk.white(options.identifier)));
    
    var location = this.findLastAngularDependency(options.module);

    var identifier =  Case.pascal(options.identifier);

    if( location.first ) {
      identifier = "\n  " + identifier + "\n";
    } else {
      identifier =  ",\n  " + identifier;
    }

    this.write(options.module, location.position, identifier);
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

  /*
   * Add an import statement to a child artifact from a parent module.
   * @param {Object} options - An options object.
   * @param {String} options.identifier - The identifier is the variable name used to to store the imported module.
   * @param {String} options.parent - The path to the parent module file.
   * @param {String} options.child - The path to the child artifact.
   */

  addModuleImport: function(options) {

    if( typeof options !== 'object' || !options.identifier || !options.parent || !options.child ) {
      return false;
    }

    options.identifier = Case.pascal(options.identifier);

    console.log(chalk.cyan(':: adding module import: ' + chalk.white(options.identifier)));

    //search the source code for the last import statement
    var lastImportLocation = this.findLastImportStatement(options.parent);

    //determine the new module import path
    var moduleImportPath = path.relative(path.dirname(options.parent), options.child);
    if( moduleImportPath.substr(0,1) !== '.' ) {
      moduleImportPath = './' + moduleImportPath;
    }

    //trim off the .js extension
    if( path.extname(moduleImportPath) == '.js') {
      moduleImportPath = moduleImportPath.substr(0, moduleImportPath.length-3);
    }

    //create the import statement
    var importStatement = "import " + options.identifier + " from '" + moduleImportPath + "';"
    if( lastImportLocation ) {
      importStatement = "\n"+importStatement;
    } else {
      importStatement = importStatement+"\n";
    }

    this.write(options.parent, lastImportLocation, importStatement);

    return true;
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

  write: function(moduleFilePath, position, text) {

    var source = fs.readFileSync(moduleFilePath).toString();
    var revisedSource = source.substr(0, position) + text + source.substr(position);
    
    fs.writeFileSync(moduleFilePath, revisedSource);

  }

});