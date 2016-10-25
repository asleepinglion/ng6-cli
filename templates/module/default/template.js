var Template = require('../../../lib/template');

module.exports = Template.extend({

  init: function() {
    this._super.apply(this, arguments);
    this.description = 'An Angular module using ES6 module imports/exports.'
  }

});
