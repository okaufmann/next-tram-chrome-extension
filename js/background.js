'use strict';

nextTramBackgroundApp.controller("BackgroundController", function ($scope, $timeout,$filter, OpenDataService) {
  var stop = null;

  $scope.refreshConnections = function(){
      console.log("refresh connections");
      var options = OpenDataService.getOptions();

      var icon = new Object();
      var title = new Object();
      var badge = new Object();
      var badge_color = new Object();

      //check options
      if(options == null){
        badge.text = "setup"
        chrome.browserAction.setBadgeText(badge);
        stop = $timeout($scope.refreshConnections, 30000);
        return;
      }

      OpenDataService.getConnections(options.connection.from,options.connection.to).success(function(data, status, headers, config) {
          console.log("returned data", data);
          if(data != null && data.connections != null && data.connections.length > 0)
          {
            var connections = data.connections;

            var firstFrom = connections[0].from.departureTimestamp;
           
            OpenDataService.setLocalConnections(connections);

            var nextConnection = OpenDataService.getNextConnection();
            
            var departuereIn = OpenDataService.getNextConnectionInMinutes();
            var departureAt = $filter('date')(nextConnection.from.departure, "dd.MM.yyyy HH:mm");
            
            var firstSection = nextConnection.sections[0];
            var sectionCategory = firstSection.journey.name.replace(firstSection.journey.number, "").trim();

            icon.path = 'images/icon.png';
            title.title = 'Departure in ' + departuereIn + " with " + sectionCategory + " Minutes at " + departureAt;
            badge.text = departuereIn +'';
            badge_color.color = [0, 0, 0, 0];

            chrome.browserAction.setBadgeBackgroundColor(badge_color);
            chrome.browserAction.setBadgeText(badge);
            chrome.browserAction.setTitle(title);
            chrome.browserAction.setIcon(icon);
            console.log("connections refreshed, next refresh in 15 seconds...");
            stop = $timeout($scope.refreshConnections, 15000);
          }else{
            console.log("can't fetch connections, try again in 10 seconds...");
            stop = $timeout($scope.refreshConnections, 10000);
          }
      }).
      error(function(data, status, headers, config) {
        console.log("can't fetch connections, try again in 10 seconds...");
        stop = $timeout($scope.refreshConnections, 10000);
      });
  };

  $scope.refreshConnections();
});