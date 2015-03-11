'use strict';

nextTramOptionsApp.controller("OptionsController", function ($scope, $timeout, $filter, OpenDataService, OptionsService) {

	$scope.form_show = false;
	$scope.lastEditIndex = null;
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
		console.log($scope.lastEditIndex);
		if($scope.connection.id == null || $scope.connection.id == undefined){
			OptionsService.addConnection($scope.connection).then(function(options){
				console.log("saved connection successfully", options.connections);
				$scope.options = options;
				$scope.connection = {};
				alert("saved connection successfully");
			}).catch(function(reason){
				console.log("error saving connection", reason);
				alert("error saving connection");
			});
		}else{
			OptionsService.setConnection($scope.lastEditIndex, $scope.connection).then(function(options){
				console.log("saved (edited) connection successfully", options);
				$scope.options = options;
				$scope.connection = {};
				alert("saved (edited) connection successfully");
			}).catch(function(reason){
				console.log("error saving connection", reason);
				alert("error saving connection");
			});
			$scope.form_show = false;
		}
		
		return false;
	};

	$scope.removeConnection = function(connection){
		var promise = confirm("want to remove?");
		if(promise === true){
			OptionsService.removeConnection(connection).then(function(options){
				$scope.options = options;
			}).catch(function(reason){
				console.log("error removing connection", reason);
				alert("error removing connection");
			});
		}
	}

	$scope.editConnection = function(index,connection){
		console.log(connection)
		$scope.connection = connection;
		$scope.form_show = true;
		$scope.lastEditIndex = index;
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