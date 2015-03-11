'use strict';

nextTramApp.controller("PageController", function ($scope, $timeout, OpenDataService, OptionsService, TimeTableService) {
    $scope.connections = [];
    $scope.setupRequired = false;
    $scope.selectedConnectionID = null;

    $scope.$watch('selectedConnectionID', function(){
        //set selected Connection
        OptionsService.getOptions().then(function(options){
            options.selectedConnectionID = $scope.selectedConnectionID;
            if($scope.selectedConnectionID != null){
                var selectedConnection = _.findWhere(options.connections, {id: options.selectedConnectionID});
                $scope.optionsFrom = selectedConnection.from;
                $scope.optionsTo = selectedConnection.to;
                $scope.optionsTimeToStation = selectedConnection.timeToStation + ' minutes';
            }
            OptionsService.setOptions(options);
            console.log(options);
        });
    });

    OptionsService.getOptions().then(function(options){
        $scope.connections = options.connections;
        $scope.selectedConnectionID = options.selectedConnectionID;
        if($scope.selectedConnectionID != null){
            var selectedConnection = _.findWhere(options.connections, {id: options.selectedConnectionID});
            $scope.optionsFrom = selectedConnection.from;
            $scope.optionsTo = selectedConnection.to;
            $scope.optionsTimeToStation = selectedConnection.timeToStation + ' minutes';
        }
    });

    $scope.showConnections = function(){
        
        //Read config
    	OptionsService.getOptions().then(function(options){
            //console.log('got options', options);
            if(options != undefined){
                $scope.setupRequired = false;
                
                var nextConnection = TimeTableService.getNextConnection();
                $scope.localConnections = TimeTableService.getLocalConnections();
                $scope.nextConnection = nextConnection;

                $scope.nextConnectionProducts = nextConnection.products;
                $scope.nextConnText = TimeTableService.getNextConnectionInMinutesText(options);
                $scope.nextConnInMin = TimeTableService.getNextConnectionInMinutes(options);
            }else{
                $scope.setupRequired = true;
            }

            $timeout($scope.showConnections,1000);
        });
    };

    $scope.showConnections();
});

nextTramApp.controller("TimeController", function($scope, $timeout, OpenDataService) {
	
    $scope.clock = "starting clock..."; // initialise the time variable

    var tick = function(){
		$scope.clock = new Date(); // get the current time;
    	$timeout(tick, 1000); // reset the timer
    };

    // Start the timers
    tick();
});
