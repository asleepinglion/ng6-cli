import <%=name_camel%>Styles from './<%= name %>.scss';
import <%=name_camel%>Component from './<%= name %>.component';

var module = angular.module('<%= moduleName %>', []);

module.component('<%= name_camel %>', <%=name_camel%>Component);

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