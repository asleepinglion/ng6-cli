import styles from './<%= name %>.scss';
import component from './<%= name %>.component';

var module = angular.module('<%= moduleName %>', []);

module.component('<%= name_camel %>', component);

export default module.name;