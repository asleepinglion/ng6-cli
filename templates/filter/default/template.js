var Template = require('../../../lib/template');

module.exports = Template.extend({

  init: function() {
    this._super.apply(this, arguments);
    this.description = 'A simple custom Angular filter.'
  }

});
