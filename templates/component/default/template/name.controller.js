<% if( cli.options.cssModules ) {
%>import styles from './<%= name %>.module.scss';<%
} else {
%>import styles from './<%= name %>.scss';<%
} %>

export default class {

  constructor() {
    'ngInject';
    <% if( cli.options.cssModules ) { %>

      //css-modules (https://github.com/webpack/css-loader#css-modules)
      this.styles = styles;
    <% } %>
  }

  $onInit() {
  }

  $onChanges() {
  }

  $onDestroy() {
  }
}