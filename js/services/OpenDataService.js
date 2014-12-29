var nextTramOpendataService = angular.module('NextTramOpenDataService', []);

nextTramOpendataService.factory('OpenDataService', function($http, $filter) {
    var srv = {};

    srv._baseUrl = "http://transport.opendata.ch/v1/";

    srv.getConnections = function(from,to){
        from = encodeURI(from);
        to = encodeURI(to);
        var url = srv._baseUrl + 'connections?from=?' + from + "&to=" + to+ "&limit=6";
        console.log("fetching new connections from ", url);

        return $http.get(url);
    };

    srv.getLocalConnections = function() {
        return angular.fromJson(localStorage['connections']);
    };

    srv.setLocalConnections = function(connections) {
        localStorage['connections'] = angular.toJson(connections);
    };

    srv.getNextConnection = function(){
        var localConns = srv.getLocalConnections();
        if(localConns != null && localConns.length > 0){
            return localConns[0];
        }else{
            return "";
        }
    };

    srv.getNextConnectionInMinutes = function(){
        var nextConn = srv.getNextConnection();
        var min = moment();
        var max = moment(nextConn.from.departure);
        var options = srv.getOptions();
        if(options != null && options.time_offset > 0){
            max.subtract(options.time_offset,"minutes");
        }
        return max.diff(min, 'minutes');
    };

    srv.getNextConnectionInMinutesText = function(){
        var nextConn = srv.getNextConnection();
        var max = moment(nextConn.from.departure);
        var options = srv.getOptions();
        if(options != null && options.time_offset > 0){
            max.subtract(options.time_offset,"minutes");
        }
        var min = moment();
        return max.from(min, true);
    };

    srv.queryLocations = function(query, type){
        /*
        type    optional    Specifies the location type, possible types are:
        all (default): Looks up for all types of locations
        station: Looks up for stations (train station, bus station)
        poi: Looks up for points of interest (Clock tower, China garden)
        address: Looks up for an address (Zurich Bahnhofstrasse 33)
        */
        query = encodeURI(query);
        type = encodeURI(type);
        var url = srv._baseUrl + 'locations?query=' + query + "&type=" + type;
        return $http.get(url);
    }

    srv.getOptions = function(){
        var optionsStorage = localStorage["options"];
        var optionsObj = {};

        if(optionsStorage != null && optionsStorage != "undefined"){
            optionsObj = angular.fromJson(optionsStorage);
            return optionsObj;
        }

        return null;
    };

    srv.setOptions = function(optionsObj){
        localStorage["options"] = angular.toJson(optionsObj);
    }

     // Public API
    return {
        getConnections:  function(from,to){
            return srv.getConnections(from,to);
        },
        getLocalConnections:  function(){
            return   srv.getLocalConnections();
        },
        setLocalConnections: function(connections){
            srv.setLocalConnections(connections);
        },
        getNextConnection: function(){
            return srv.getNextConnection();
        },
        getNextConnectionInMinutes: function(){
            return srv.getNextConnectionInMinutes();
        },
        getNextConnectionInMinutesText: function(){
            return srv.getNextConnectionInMinutesText();
        },
        queryLocations:function(query, type){
            return srv.queryLocations(query,type);
        },
        getOptions:function(){
            return srv.getOptions();
        },
        setOptions:function(optionsObj){
            srv.setOptions(optionsObj);
        }
    };
});