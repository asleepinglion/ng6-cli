var Template = require('../../../lib/template');

module.exports = Template.extend({

  init: function() {
    this._super.apply(this, arguments);
    this.description = 'An angular.component following industry best practices.'
  },

  config: function() {

    var config = {
      rename: {
        '.': {
        }
      }
    };

    if( !this.cli.getOption('cssModules') ) {
      config.rename['.']['name.module.scss'] = { basename: 'name' };
    }

    if( this.cli.getOption('directive') || this.cli.getOption('d') ) {
      config.rename['.']['name.component.js'] = { basename: 'name.directive' };
    }

    return config;

  }

});
