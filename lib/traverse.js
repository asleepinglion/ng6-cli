var fs = require('fs');
var path = require('path');
var BaseClass = require('ouro-base');

module.exports = BaseClass.extend({

  init: function(cli) {
    this.cli = cli;
  },

  files: function(callback) {
    var projectRoot = this.cli.reflect.projectRoot();
    var files = this.walkFiles(projectRoot);
    return files.map(callback);
  },

  walkFiles: function(dir, files = []) {
    // get the list of files in the dir
    var ls = fs.readdirSync(dir);

    // loop through files in the dir
    ls.forEach(file => {
      var modulePath = path.resolve(dir, file);

      if (!fs.statSync(modulePath).isDirectory()) {

        var fullPath = path.resolve(dir, file);
        files.push(fullPath);

      } else {
        if (file !== 'node_modules') { // don't walk through node_modules
          // walk through sub-modules
          files = this.walkFiles(modulePath, files);
        }
      }

    });

    return files;
  },

  packages: function(callback) {
    var projectRoot = this.cli.reflect.projectRoot();
    var modules = this.walkPackages(projectRoot);
    return modules.map(callback);
  },

  walkPackages: function(dir, modules = []) {
    // get the list of files in the dir
    var ls = fs.readdirSync(dir);

    // loop through files in the dir
    ls.forEach(file => {

      // detect if this is a directory
      if (fs.statSync(path.resolve(dir, file)).isDirectory() && file !== 'node_modules') {

        var modulePath = path.resolve(dir, file);
        var pkgPath = path.resolve(modulePath, 'package.json');

        if (fs.existsSync(pkgPath)) {
          modules.push(pkgPath);
        }

        // walk through sub-modules
        modules = this.walkPackages(modulePath, modules);

      }

    });

    return modules;
  }

});
