'use strict';

// Run our kitten generation script as soon as the document's DOM is ready.
/*document.addEventListener('DOMContentLoaded', function () {
	console.log("load");
	opendataReader.getdata(opendataReader.setdata);
});*/

nextTramApp.controller("PageController", function ($scope, $timeout, OpenDataService) {
    $scope.setupRequired = true;

    $scope.showConnections = function(){
        //Read config
    	var options = OpenDataService.getOptions();

    	//Check config
        if(options != null){
            $scope.optionsFrom = options.connection.from;
            $scope.optionsTo = options.connection.to;
            $scope.setupRequired = false;
            
            var nextConnection = OpenDataService.getNextConnection();
            $scope.connections = OpenDataService.getLocalConnections();
            $scope.nextConnection = nextConnection;
            $scope.nextConnectionSectionCategory = nextConnection.sections[0].journey.name.replace(nextConnection.sections[0].journey.number, "").trim();
            $scope.nextConnText = OpenDataService.getNextConnectionInMinutesText();
            $scope.nextConnInMin = OpenDataService.getNextConnectionInMinutes();
        }else{
            $scope.setupRequired = true;
        }

        $timeout($scope.showConnections,1000);
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
