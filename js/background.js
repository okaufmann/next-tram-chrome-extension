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
            try{

                var icon = new Object();
                var title = new Object();
                var badge = new Object();
                var badge_color = new Object();

                //check options
                if(options == null || options == undefined){
                    console.log("no connections defined yet. Go to options page!");
                    badge.text = "setup"
                    chrome.browserAction.setBadgeText(badge);
                    stop = $timeout($scope.refreshConnections, 5000);
                    return;
                }

                console.log("options ok, got:", options);

                var selectedConnection = _.findWhere(options.connections, {id: options.selectedConnectionID});
                console.log(selectedConnection);

                //17:30
                //YYYY-MM-DD
                var dateTime = moment().add(selectedConnection.timeToStation, 'minutes');
                var time = dateTime.format('HH:mm');
                var date = dateTime.format('YYYY-MM-DD');

                OpenDataService.getConnections(selectedConnection.from, selectedConnection.to, time, date)
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
                        //var sectionCategory = firstSection.journey.name.replace(firstSection.journey.number, "").trim();

                        var leaveIn = (departuereIn - selectedConnection.timeToStation);

                        if(leaveIn > 10){
                            badge_color.color = "#04B404"; //green
                        }else if(leaveIn > 0){
                            badge_color.color = "#DF3A01"; // orange
                        }else if(leaveIn == 0){
                            leaveIn = 'now';
                            badge_color.color = "#FF0000"; //red
                        }else{
                            leaveIn = 'missed';
                            badge_color.color = "#FF0000"; //red
                        }

                        icon.path = 'images/icon.png';

                        if(leaveIn >= 0){
                            title.title = 'You have to leave in ' + leaveIn + ' minutes to catch the next connection';
                        }else{
                            title.title = 'You missed the connection, wait for the next one...';
                        }
                        
                        badge.text = leaveIn + '';

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
            }catch(ex){
                console.log("error fetching connections!, try again in 10 seconds...", ex);
                stop = $timeout($scope.refreshConnections, 10000);
            }
        });
    };

    $scope.refreshConnections();
});