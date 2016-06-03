import <%=name_camel%>Component from './<%= name %>.component';

var module = angular.module('<%= moduleName %>', []);

module.component('<%= name_camel %>', <%=name_camel%>Component);

export default module.name;