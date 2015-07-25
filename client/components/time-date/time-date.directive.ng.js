'use strict'

angular.module('meteorApp')
.directive('mdButton', [function(){
    return {
        replace: true,
        restricte: 'E',
        transclude: true,
        template: '<button class="btn btn-link md-button" ng-transclude></button>'
    };
}]);
