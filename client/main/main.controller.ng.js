'use strict'

angular.module('meteorApp')
.controller('MainCtrl', function($scope, $meteor, $state, $window) {
  var vm = $scope;
  vm.page = 1;
  vm.perPage = 3;
  vm.sort = {name_sort : 1};
  vm.orderProperty = '1';

  vm.things = $meteor.collection(function() {
    return Things.find({}, {sort:vm.getReactively('sort')});
  });
  $meteor.autorun(vm, function() {
    $meteor.subscribe('things', {
      limit: parseInt(vm.getReactively('perPage')),
      skip: parseInt((vm.getReactively('page') - 1) * vm.getReactively('perPage')),
      sort: vm.getReactively('sort')
    }, vm.getReactively('search')).then(function() {
      vm.thingsCount = $meteor.object(Counts, 'numberOfThings', false);
    });
  });

  vm.trelloConnect = function() {
    Meteor.call('trelloConnect', function(err, url) {
      if (err) {
        console.log(err);
      }

      console.log(url);
      $window.location.href = url;
    });
  }

  vm.trelloGetMe = function() {
    Meteor.call('trelloGetMe', function(err, data) {
      console.log(err, data);
    });
  }

  vm.save = function() {
    if(vm.form.$valid) {
      vm.things.save(vm.newThing);
      vm.newThing = undefined;
    }
  };

  vm.remove = function(thing) {
    vm.things.remove(thing);
  };

  vm.pageChanged = function(newPage) {
    vm.page = newPage;
  };

  vm.goto = function(state) {
    $state.go(state);
  }

  vm.$watch('orderProperty', function() {
    if(vm.orderProperty) {
      vm.sort = {name_sort: parseInt(vm.orderProperty)};
    }
  });
});