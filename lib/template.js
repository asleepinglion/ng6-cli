var BaseClass = require('ouro-base');

module.exports = BaseClass.extend({

  init: function (cli) {

    this.cli = cli;
    this.extend = false;
    this.description = 'This template\'s description has not been set yet.';

  }

});
