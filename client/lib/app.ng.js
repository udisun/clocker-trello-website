angular.module('meteorApp', [
  'angular-meteor',
  'ui.router',
  'angularUtils.directives.dirPagination',
  'ngMessages',
  'ngAria',
  'formly',
  'lumx',
  'formlyLumx',
  'mdDateTime',
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

window.center = function (el) {
    el.css("position","absolute");
    el.css("top", Math.max(0, (($(window).height() - $(el).outerHeight()) / 2) +
                                                $(window).scrollTop()) + "px");
    el.css("left", Math.max(0, (($(window).width() - $(el).outerWidth()) / 2) +
                                                $(window).scrollLeft()) + "px");
    return el;
}
