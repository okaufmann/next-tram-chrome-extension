'use strict';

nextTramOptionsApp.controller("OptionsController", function ($scope, $timeout, $filter, OpenDataService, OptionsService) {

	$scope.form_show = false;
	OptionsService.getOptions().then(function(options){
    	console.log('got options', options);
    	if(options == undefined){
    		$scope.options = {};
    	}
		$scope.options = options;
    });

	$scope.loadingLocations = false;

	$scope.saveConnection = function (argument) {
		console.log('add connection');
		OptionsService.addConnection($scope.connection).then(function(options){
			console.log("saved connections", options.connections);
			$scope.options = options;
			$scope.connection = {};
			alert("saved");
		}).catch(function(reason){
			console.log("error saving connection", reason);
			alert("error saving connection");
		});
		return false;
	};

	$scope.removeConnection = function(index){
		var promise = confirm("want to remove?");
		if(promise === true){
			OptionsService.removeConnection(index).then(function(options){
				$scope.options = options;
			}).catch(function(reason){
				console.log("error removing connection", reason);
				alert("error removing connection");
			});
		}
	}

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