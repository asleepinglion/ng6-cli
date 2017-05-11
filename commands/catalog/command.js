var fs = require('fs');
var chalk = require('chalk');
var axios = require('axios');
var Command = require('../../lib/command');

module.exports = Command.extend({

  init: function() {

    this._super.apply(this, arguments);

    this.description = 'Catalog components & services within this project.';
    this.options = '';
    this.category = 'other';
    this.order = 7;

  },

  run: function() {

    this.projectName = this.cli.reflect.projectName();

    console.log(chalk.cyan(':: cataloging project:'), chalk.white(this.projectName));

    var index = 0;

    var modules = this.cli.traverse.packages(pkgPath => {
      var pkg = require(pkgPath);

      return {
        name: pkg.name,
        view: pkg.view || false,
        component: pkg.component || false,
        version: pkg.version,
        description: pkg.description,
        collection: this.projectName,
        _id: this.projectName + ':' + pkg.name + ':' + index++
      };
    });

    var components = modules.filter(mod => mod.component);
    var views = modules.filter(mod => mod.view);

    console.log();
    console.log(chalk.cyan(':: ' + chalk.white(components.length) + ' components found.') );
    console.log(chalk.cyan(':: ' + chalk.white(views.length) + ' views found.') );

    if (this.cli.request.getOption('output-file')) {
      fs.writeFile(this.cli.request.getOption('output-file'), JSON.stringify(modules, null, 2), (err) => {
        if(err) {
          console.log(err);
          throw err;
        }
      });
    }

    if (this.cli.request.getOption('catalog-url')) {
      axios.post(this.cli.request.getOption('catalog-url'), modules.views.concat(modules.components))
      .then(function(response) {
        console.log(chalk.cyan(':: catalog updated successfully:'), response.data.message);
      })
      .catch(function(err) {
        console.log(chalk.cyan(':: catalog update failed:') );
        console.log(err);
      });
    }

  }

});
