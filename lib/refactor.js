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

    var identifier =  Case.pascal(options.identifier);

    console.log(chalk.cyan(':: adding angular dependency: ' + chalk.white(identifier) + chalk.gray(' ('+path.relative(this.cli.reflect.projectRoot(), options.module)+')')));

    var source = fs.readFileSync(options.module).toString();
    var ast = recast.parse(source);
    var n = recast.types.namedTypes;
    var b = recast.types.builders;
    var toInsert = b.identifier(identifier);
    
    var angularModule = _.findIndex(ast.program.body, node =>
      n.VariableDeclaration.check(node) && node.declarations[0].init.callee.object.name === 'angular'
    );
    
    // If we didn't find an `const module = angular.module`
    // Let's try looking for expression `angular.module`
    if( angularModule === -1 ) {
      angularModule = _.findIndex(ast.program.body, node => {
        try {
          return n.ExpressionStatement.check(node) && node.expression.callee.object.callee.object.callee.object.name === 'angular';
        } catch(e) {
          return false;
        }
      });
      ast.program.body[angularModule].expression.callee.object.callee.object.arguments[1].elements.push(toInsert);
    } else {
      ast.program.body[angularModule].declarations[0].init.arguments[1].elements.push(toInsert);
    }
    
    var revisedSource = recast.print(ast).code;
    fs.writeFileSync(options.module, revisedSource);
    return true;
  },

  removeAngularDependency: function(options) {

    if( typeof options !== 'object' || !options.identifier || !options.module) {
      return false;
    }

    var identifier =  Case.pascal(options.identifier);
    
    var prettyPath = path.relative(this.cli.reflect.projectRoot(), options.module);
    var dirs = prettyPath.split('/');
    dirs.pop();
    var dirName = dirs.pop();
    var ComponentsName = `${Case.pascal(dirName)}${identifier}`;

    if(identifier === 'Components') {
      console.log(chalk.cyan(':: removing angular dependency: ' + chalk.white(ComponentsName) + chalk.gray(' (' + prettyPath + ')')));
    } else {
      console.log(chalk.cyan(':: removing angular dependency: ' + chalk.white(identifier) + chalk.gray(' (' + prettyPath + ')')));
    }
    

    var source = fs.readFileSync(options.module).toString();
    var ast = recast.parse(source);
    var n = recast.types.namedTypes;


    var angularModule = _.findIndex(ast.program.body, node =>
      n.VariableDeclaration.check(node) && node.declarations[0].init.callee.object.name === 'angular'
    );
    
    // If we didn't find an `const module = angular.module`
    // Let's try looking for expression `angular.module`
    var isVarDecl = true;
    if( angularModule === -1 ) {
      isVarDecl = false;
      angularModule = _.findIndex(ast.program.body, node => {
        try {
          return n.ExpressionStatement.check(node) && node.expression.callee.object.callee.object.callee.object.name === 'angular';
        } catch(e) {
          return false;
        }
      });
    }
    
    var toRemove = -1;

    if(isVarDecl) {
      toRemove = _.findIndex(
        ast.program.body[angularModule].declarations[0].init.arguments[1].elements,
        node => node.name === identifier || node.name === ComponentsName
      );
    } else {
      toRemove = _.findIndex(
        ast.program.body[angularModule].expression.callee.object.callee.object.arguments[1].elements,
        node => node.name === identifier
      );
    }

    if( toRemove === -1 ) {
      console.log(chalk.yellow('\nDid not find angular dependency ' + chalk.white(options.identifier) + ' in module ' + chalk.gray(prettyPath)));
      return false;
    }

    if(isVarDecl) {
      ast.program.body[angularModule].declarations[0].init.arguments[1].elements.splice(toRemove, 1);
    } else {
      ast.program.body[angularModule].expression.callee.object.callee.object.arguments[1].elements.splice(toRemove, 1);
    }
    
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

    // TODO: check if already exists!

    var identifier = Case.pascal(options.identifier);
    var prettyPath = path.relative(this.cli.reflect.projectRoot(), options.parent);

    console.log(chalk.cyan(':: adding module import: ' + chalk.white(identifier) + chalk.gray(' (' + prettyPath + ')')));

    // determine the new module import path
    var moduleImportPath = './' + path.relative(path.dirname(options.parent), options.child);
    moduleImportPath = moduleImportPath.substr(0, moduleImportPath.length - 3); // remove file ending.

    var source = fs.readFileSync(options.parent).toString();
    var ast = recast.parse(source);
    var b = recast.types.builders;
    var lastImportIndex = this.cli.reflect.findLastImportStatement(options.parent);

    if( lastImportIndex === -1 ) {
      // There is no ImportDeclaration in the source file, so we insert in the beginning.
      lastImportIndex = 0;
    }

    var toInsert = b.importDeclaration(
      [b.importDefaultSpecifier( b.identifier(identifier) )], 
      b.literal(moduleImportPath)
    );

    if( lastImportIndex === 0) {
      ast.program.body.unshift(toInsert);
    } else {
      ast.program.body.splice(lastImportIndex + 1, 0, toInsert);
    }
    var revisedSource = recast.print(ast, { quote: 'single' }).code;
    fs.writeFileSync(options.parent, revisedSource);
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
