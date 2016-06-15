var BaseClass = require('ouro-base');
var _ = require('lodash');

module.exports = BaseClass.extend({

  init: function() {

  },

  check: function(webpackConfig) {

    if( !_.isObject(webpackConfig) ) {
      return false;
    }

    if( !_.isObject(webpackConfig.entry) ) {
      return false;
    }

    if( !_.isObject(webpackConfig.output) ) {
      return false;
    }

    if( !_.isObject(webpackConfig.module) ) {
      return false;
    }

    if( !_.isArray(webpackConfig.module.loaders) ) {
      return false;
    }

    return true;
  }

});