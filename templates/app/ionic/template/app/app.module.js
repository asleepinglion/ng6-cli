console.log('application loading...');

import angular from 'angular';
import uiRouter from 'angular-ui-router';
import animate from 'angular-animate';
import 'ionic-sdk/release/js/ionic.bundle';
import AppStyles from '../styles/app.scss';
import AppComponent from './app.component';

//create our app module and setup core dependencies
angular.module('app', [

  uiRouter,
  animate,
  'ionic'

])

.config(function($urlRouterProvider, $locationProvider) {
  'ngInject';

  // @see: https://github.com/angular-ui/ui-router/wiki/Frequently-Asked-Questions
  // #how-to-configure-your-server-to-work-with-html5mode
  //$locationProvider.html5Mode(true);

  //setup default route
  $urlRouterProvider.otherwise('/');

})

.run(($ionicPlatform) => {
  'ngInject';

  $ionicPlatform.ready(() => {

    // Hide the accessory bar by default (remove this to show the accessory bar above the keyboard
    // for form inputs)
    if (window.cordova && window.cordova.plugins.Keyboard) {
      cordova.plugins.Keyboard.hideKeyboardAccessoryBar(true);
      cordova.plugins.Keyboard.disableScroll(true);

    }
    if (window.StatusBar) {
      // org.apache.cordova.statusbar required
      StatusBar.styleDefault();
    }
  });

})

//setup root component
.component('app', AppComponent);

