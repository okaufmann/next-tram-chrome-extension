'use strict';

nextTramOptionsApp.controller("OptionsController", function ($scope, $timeout, $filter, OpenDataService, OptionsService) {

	OptionsService.getOptions().then(function(options){
    	console.log('got options', options);
    	if(options == undefined){
    		$scope.options = {};
    	}
		$scope.options = options;        	
    });

	$scope.loadingLocations = false;

	$scope.saveConnection = function (argument) {
		OptionsService.setOptions($scope.options);
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