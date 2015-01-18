'use strict';

// Run our kitten generation script as soon as the document's DOM is ready.
/*document.addEventListener('DOMContentLoaded', function () {
	console.log("load");
	opendataReader.getdata(opendataReader.setdata);
});*/

nextTramApp.controller("PageController", function ($scope, $timeout, OpenDataService, OptionsService) {
    $scope.setupRequired = true;

    $scope.showConnections = function(){
        //Read config
    	OptionsService.getOptions().then(function(options){
            console.log('got options', options);
            if(options != undefined){
                $scope.setupRequired = false;
                
                $scope.optionsFrom = options.connection.from;
                $scope.optionsTo = options.connection.to;
                
                var nextConnection = OpenDataService.getNextConnection();
                $scope.connections = OpenDataService.getLocalConnections();
                $scope.nextConnection = nextConnection;
                $scope.nextConnectionSectionCategory = nextConnection.sections[0].journey.name.replace(nextConnection.sections[0].journey.number, "").trim();
                $scope.nextConnText = OpenDataService.getNextConnectionInMinutesText(options);
                $scope.nextConnInMin = OpenDataService.getNextConnectionInMinutes(options);
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
