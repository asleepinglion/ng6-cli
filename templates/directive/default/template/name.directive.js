import controller from './<%= name %>.controller';
import template from './<%= name %>.html';

export default function() {
  return {
    controller,
    template,
    restrict: 'E'
  };
};
