'use strict';

/* App Module */

var phonecatApp = angular.module('phonecatApp', [
  'ngRoute',
  'ngSanitize',
  'phonecatControllers',
  'ui.bootstrap',
  'angularFileUpload'
]);

phonecatApp.config(['$routeProvider',
  function($routeProvider) {
    $routeProvider.
	  when('/home', {
        templateUrl: 'partials/home.html',
        controller: 'homePageCtrl'
      }).
	  when('/login', {
        templateUrl: 'partials/login.html',
        controller: 'loginPageCtrl'
      }).
	  when('/register', {
        templateUrl: 'partials/register.html',
        controller: 'registrationPageCtrl'
      }).
	   when('/profile', {
        templateUrl: 'partials/profile.html',
        controller: 'profilePageCtrl'
      }).
	  when('/photos', {
        templateUrl: 'partials/photos.html',
        controller: 'photosPageCtrl'
      }).
	  when('/recover', {
        templateUrl: 'partials/recover.html',
        controller: 'recoverPageCtrl'
      }).
      otherwise({
        redirectTo: '/login'
      });
  }]);

  
 phonecatApp.directive('loading', function () {
      return {
        restrict: 'E',
        replace:true,
        template: '<div class="loading" style="position:absolute; top:0px; left:0px; width:100%; height:100vh; display:block; background:rgba(255,255,255,0.7); z-index:999"><img src="img/loader.gif" width="50" height="50" style="margin: auto; position: absolute;top: 0; left: 0; bottom: 0; right: 0;"/></div></div>',
        link: function (scope, element, attr) {
              scope.$watch('loading', function (val) {
                  if (val)
                      $(element).show();
                  else
                      $(element).hide();
              });
        }
      }
  });