import <%=name_camel%>Component from './<%= name %>.directive';

const module = angular.module('<%= moduleName %>', []);

module.directive('<%= name_camel %>', <%=name_camel%>Component);

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
