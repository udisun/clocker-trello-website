angular.module('meteorApp', [
  'angular-meteor',
  'ui.router',
  'angularUtils.directives.dirPagination',
  'formly',
  'lumx',
  'mgo-angular-wizard'
]);

onReady = function() {
  angular.bootstrap(document, ['meteorApp']);
};
  
if(Meteor.isCordova) {
  angular.element(document).on('deviceready', onReady);
} else {
  angular.element(document).ready(onReady);
}