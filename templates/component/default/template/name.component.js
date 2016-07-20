import template from './<%= name %>.html';
import controller from './<%= name %>.controller';

<% if( cli.request.options.directive || cli.request.options.d ) { %>
export default function() {
  return {
    template,
    controller,
    restrict: 'E',
    //replace: true,
    bindToController: true,
    controllerAs: '$ctrl'
  };
};
<% } else { %>
export default {
  template,
  controller,
  bindings: {
  }
};
<% } %>