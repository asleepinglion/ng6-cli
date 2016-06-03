import template from './<%= name %>.html';
import controller from './<%= name %>.controller';

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