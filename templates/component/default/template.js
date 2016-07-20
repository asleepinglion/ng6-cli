var path = require('path');
var chalk = require('chalk');
var Template = require('../../../lib/template');
var Case = require('case');

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

    var configOptions = this.cli.config.get('options');
    var requestOptions = this.cli.request.request.options;

    if( !configOptions.cssModules ) {
      config.rename['.']['name.module.scss'] = { basename: 'name' };
    }

    if( requestOptions.directive || requestOptions.d ) {
      config.rename['.']['name.component.js'] = { basename: 'name.directive' };
    }

    return config;

  }

});