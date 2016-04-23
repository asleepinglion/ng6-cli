import <%=name_camel%>Styles from './<%= name %>.scss';
import <%=name_camel%>Directive from './<%= name %>.directive';

var module = angular.module('<%= moduleName %>', []);

module.directive('<%= name_camel %>', <%=name_camel%>Directive);

export default module.name;