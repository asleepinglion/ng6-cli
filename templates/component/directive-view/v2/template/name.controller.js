import styles from './<%= name %>.module.scss';

export default class {

  constructor() {
    'ngInject';

    //css-modules (https://github.com/webpack/css-loader#css-modules)
    this.styles = styles;
  }

  $onInit() {
  }

  $onChanges() {
  }

  $onDestroy() {
  }
}