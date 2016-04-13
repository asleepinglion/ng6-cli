var fs = require('fs');
var path = require('path');
var BaseClass = require('ouro-base');
var chalk = require('chalk');
var homedir = require('homedir');

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

  }

});