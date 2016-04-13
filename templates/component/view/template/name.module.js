import styles from './<%= name %>.scss';
import component from './<%= name %>.component';

var module = angular.module('<%= moduleName %>', []);

module.component('<%= name_camel %>', component);

//configure component states
module.config(function($stateProvider) {
  'ngInject';

  $stateProvider
    .state('<%= name %>', {
      url: '/<%= name %>',
      template: '<<%= name %>></<%= name %>>'
    });
});

export default module.name;