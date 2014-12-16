'use strict';

nextTramOptionsApp.controller("OptionsController", function ($scope, $timeout, $filter, OpenDataService) {
	$scope.loadingLocations = false;
	$scope.options = OpenDataService.getOptions();

	var options = OpenDataService.getOptions();

	$scope.saveConnection = function (argument) {
		OpenDataService.setOptions($scope.options);
		alert("saved");
		console.log(localStorage);
	};

	$scope.getStation = function(query){
		console.log("search for station with text '" + query + "'");
		$scope.loadingLocations = false;
		return OpenDataService.queryLocations(query,"station").then(function(response){
			return response.data.stations.map(function(item){
		        return item.name;
	      	});
		});
		
	};
});