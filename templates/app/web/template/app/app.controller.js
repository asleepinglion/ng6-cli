<% if( cli.options.cssModules ) {
%>import styles from './app.module.scss';<%
} else {
%>import styles from './app.component.scss';<%
} %>

export default class {

  constructor() {
    'ngInject';
    <% if( cli.options.cssModules ) { %>

    //css-modules (https://github.com/webpack/css-loader#css-modules)
    this.styles = styles;<% } %>
  }

  $onInit() {
  }

  $onChanges() {
  }

  $onDestroy() {
  }
}
