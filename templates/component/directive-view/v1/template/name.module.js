import <%=name_camel%>Styles from './<%= name %>.scss';
import <%=name_camel%>Directive from './<%= name %>.directive';

var module = angular.module('<%= moduleName %>', []);

module.directive('<%= name_camel %>', <%=name_camel%>Directive);

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