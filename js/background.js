'use strict';

var onInstall = function(details) {
    console.log("extension update check");

    console.log("installed extension");
    console.log(details);

    var id = details.id;

    if(details.reason = "install"){
        console.log("first install");
        alert("thx for installing Next Tram");
        chrome.tabs.create({url: "options.html"});
        localStorage.clear();
    } 
    else if(details.reason = "update") {
        //chrome.browserAction.setBadgeText({"text" :"New" }); // tell the user  
        console.log("new version installed:", id);
        alert("Next Tram successfully updated.");
        extensions[id] = details; // track the extension
    }
};

chrome.runtime.onInstalled.addListener(onInstall);

nextTramBackgroundApp.controller("BackgroundController", function ($scope, $timeout,$filter, OpenDataService, OptionsService, TimeTableService) {
  var stop = null;

  $scope.refreshConnections = function(){
      OptionsService.getOptions().then(function(options){
        console.log('got options', options);
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

        var selectedConnection = _.findWhere(options.connections, {id: options.selectedConnectionID});
        console.log(selectedConnection);
        OpenDataService.getConnections(selectedConnection.from, selectedConnection.to)
        .success(function(data, status){
            console.log("fetched connections from API: ",data);
            if(data != null && data.connections != null && data.connections.length > 0)
            {
                var connections = data.connections;
                var firstFrom = connections[0].from.departureTimestamp;

                TimeTableService.setLocalConnections(connections);

                var nextConnection = TimeTableService.getNextConnection();

                var departuereIn = TimeTableService.getNextConnectionInMinutes();
                var departureAt = $filter('date')(nextConnection.from.departure, "dd.MM.yyyy HH:mm");

                var firstSection = nextConnection.sections[0];
                var sectionCategory = firstSection.journey.name.replace(firstSection.journey.number, "").trim();

                var leaveIn = (departuereIn - selectedConnection.timeToStation);

                icon.path = 'images/icon.png';
                title.title = 'You have to leave in ' + leaveIn + 'minutes to catch the next ...';
                badge.text = leaveIn + '';
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
    });
        // }).
        // error(function(data, status, headers, config) {
        //   console.log("can't fetch connections, try again in 10 seconds...");
        //   stop = $timeout($scope.refreshConnections, 10000);
        // });
  };

  $scope.refreshConnections();
});