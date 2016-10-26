var Command = require('../../lib/command');

module.exports = Command.extend({

  init: function() {

    this._super.apply(this, arguments);

    this.description = 'Migrate to new versions of app & artifact templates.';
    this.options = '';
    this.order = 14;

  },

  run: function() {

    console.log('This command will be available shortly.');
    console.log('');

  }
});
