var Template = require('../../../lib/template');

module.exports = Template.extend({

  init: function() {
    this._super.apply(this, arguments);
    this.description = 'An Ionic directive-based view component with replace enabled.'
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

    return config;

  }

});
