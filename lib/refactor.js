var fs = require('fs');
var path = require('path');
var BaseClass = require('ouro-base');
var Case = require('case');
var chalk = require('chalk');
var recast = require('recast');
var _ = require('lodash');

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
   */

  addAngularDefinition: function(options) {

    if( typeof options !== 'object' || !options.name || !options.type || !options.module  ) {
      return false;
    }

    console.log(chalk.cyan(':: adding angular definition: ' + chalk.white(options.name) + chalk.gray(' ('+path.relative(this.cli.reflect.projectRoot(), options.module)+')')));

    var location = this.cli.reflect.findLastAngularDefinition(options.module);

    var identifier = Case.pascal(options.name);
    var artifactName = (['service'].indexOf(options.type) === -1 ) ? Case.camel(options.name) : Case.pascal(options.name);

    //create the angular definition statement
    var angularDefinition = 'module.' + options.type + '(\'' + artifactName + '\', ' + identifier  + ');'

    if( location.first ) {
      angularDefinition = '\n\n'+angularDefinition;
    } else {
      angularDefinition = '\n'+angularDefinition;
    }

    this.write(options.module, location.position, angularDefinition);

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

    var location = this.cli.reflect.findLastAngularDependency(options.module);

    var identifier =  Case.pascal(options.identifier);

    console.log(chalk.cyan(':: adding angular dependency: ' + chalk.white(identifier) + chalk.gray(' ('+path.relative(this.cli.reflect.projectRoot(), options.module)+')')));

    if( location.first ) {
      identifier = '\n  ' + identifier + '\n';
    } else {
      identifier =  ',\n  ' + identifier;
    }

    this.write(options.module, location.position, identifier);
  },

  removeAngularDependency: function(options) {

    if( typeof options !== 'object' || !options.identifier || !options.module) {
      return false;
    }

    var identifier =  Case.pascal(options.identifier);
    var prettyPath = path.relative(this.cli.reflect.projectRoot(), options.module);

    console.log(chalk.cyan(':: removing angular dependency: ' + chalk.white(identifier) + chalk.gray(' (' + prettyPath + ')')));

    var source = fs.readFileSync(options.module).toString();
    var ast = recast.parse(source);
    var n = recast.types.namedTypes;
    var varDec = _.findIndex(ast.program.body, node =>
      n.VariableDeclaration.check(node) && node.declarations[0].init.callee.object.name === 'angular'
    );
    var toRemove = _.findIndex(ast.program.body[varDec].declarations[0].init.arguments[1].elements, node => node.name === identifier);

    if( toRemove === -1 ) {
      console.log(chalk.yellow('\nDid not find angular dependency ' + chalk.white(options.identifier) + ' in module ' + chalk.gray(prettyPath)));
      return false;
    }

    ast.program.body[varDec].declarations[0].init.arguments[1].elements.splice(toRemove, 1);
    var revisedSource = recast.print(ast).code;
    fs.writeFileSync(options.module, revisedSource);
    return true;
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

    var identifier = Case.pascal(options.identifier);

    console.log(chalk.cyan(':: adding module import: ' + chalk.white(identifier) + chalk.gray(' ('+path.relative(this.cli.reflect.projectRoot(), options.parent)+')')));

    //search the source code for the last import statement
    var lastImportLocation = this.cli.reflect.findLastImportStatement(options.parent);

    //determine the new module import path
    var moduleImportPath = path.relative(path.dirname(options.parent), options.child);
    if( moduleImportPath.substr(0,1) !== '.' ) {
      moduleImportPath = './' + moduleImportPath;
    }

    //trim off the .js extension
    if( path.extname(moduleImportPath) == '.js') {
      moduleImportPath = moduleImportPath.substr(0, moduleImportPath.length-3);
    }

    //make sure we use unix-style paths for the import
    moduleImportPath = moduleImportPath.replace(/\\/g, '/');

    //create the import statement
    var importStatement = 'import ' + identifier + ' from \'' + moduleImportPath + '\';'
    if( lastImportLocation ) {
      importStatement = '\n'+importStatement;
    } else {
      importStatement = importStatement+'\n';
    }

    this.write(options.parent, lastImportLocation, importStatement);

    return true;
  },

  removeModuleImport: function(options) {
    if( typeof options !== 'object' || !options.identifier || !options.parent ) {
      return false;
    }

    var prettyPath = path.relative(this.cli.reflect.projectRoot(), options.parent);

    console.log(chalk.cyan(':: removing module import: ' + chalk.white(options.identifier) + chalk.gray(' (' + prettyPath + ')')));

    var source = fs.readFileSync(options.parent).toString();
    var ast = recast.parse(source);
    var n = recast.types.namedTypes;
    var toRemove = _.findIndex(ast.program.body, node => n.ImportDeclaration.check(node) && node.source.value.endsWith(`${options.identifier}.module`));

    if( toRemove === -1 ) {
      console.log(chalk.yellow('\nDid not find module import ' + chalk.white(options.identifier) + ' in module ' + chalk.gray(prettyPath)));
      return false;
    }

    ast.program.body.splice(toRemove, 1);
    var revisedSource = recast.print(ast).code;
    fs.writeFileSync(options.parent, revisedSource);
    return true;
  },

  write: function(moduleFilePath, position, text) {

    var source = fs.readFileSync(moduleFilePath).toString();
    var revisedSource = source.substr(0, position) + text + source.substr(position);

    fs.writeFileSync(moduleFilePath, revisedSource);
  },

});
