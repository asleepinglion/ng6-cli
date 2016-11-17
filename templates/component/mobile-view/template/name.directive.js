import template from './<%= name %>.html';
import controller from './<%= name %>.controller';

export default function() {
  return {
    template,
    controller,
    restrict: 'E',
    controllerAs: '$ctrl',
    replace: true,

  };
};