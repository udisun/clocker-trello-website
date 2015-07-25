'use strict'

angular.module('meteorApp')
.controller('TimesCtrl', function($scope, $meteor) {
	var vm = $scope;
  vm.viewName = 'Times';

  $meteor.subscribe('times');
  vm.times = $meteor.collection(Times, {});

  // The model object that we reference
  // on the  element in index.html
  vm.timeForm = {};
  
  // An array of our form fields with configuration
  // and options set. We make reference to this in
  // the 'fields' attribute on the  element
  vm.timeFields = [];
  vm.timeFields = _.compact(_.pluck(Times._c2._simpleSchema._schema, 'formly'));
  console.log(vm.timeFields);
  // _.each(Times._c2._simpleSchema._schema, function(value, key, list) {
  // 	console.log(value);
  // 	if (typeof value.formly !== 'undefined') {
  // 		vm.timeFields.push(value.formly);
  // 	}
  // });

  //console.log(vm.rentalFields);
  

  vm.timeFormSubmit = function() {
    if($scope.timeForm.$valid) {

      $scope.times.save({
    		title: $scope.timeForm.title,
    		time: $scope.timeForm.date
    	}).then(
      	function (numberOfDocs) {
					console.log('save successful, docs affected ', numberOfDocs);

					console.log($scope.timeForm);

					$scope.timeForm.setPristine();
				},
				function (error) {
					console.log('save error ', error);
				}
      );
      //$scope.newTime = undefined;
    }
  };
});