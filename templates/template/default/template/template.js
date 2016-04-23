var path = require('path');
var chalk = require('chalk');
var Template = require('ng6-cli').Template;
var Case = require('case');

module.exports = Template.extend({

  init: function() {
    this._super.apply(this, arguments);
    this.description = 'This a new template -- please update the template.js description.';
  }

});