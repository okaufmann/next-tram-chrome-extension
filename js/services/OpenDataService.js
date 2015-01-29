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

    srv.getNextConnection = function(){
        var localConns = srv.getLocalConnections();
        if(localConns != null && localConns.length > 0){
            return localConns[0];
        }else{
            return "";
        }
    };

    srv.getNextConnectionInMinutes = function(options){
        var nextConn = srv.getNextConnection();
        var min = moment();
        var max = moment(nextConn.from.departure);

        if(options != null && options.time_offset > 0){
            max.subtract(options.time_offset,"minutes");
        }
        return max.diff(min, 'minutes');
    };

    srv.getNextConnectionInMinutesText = function(options){
        var nextConn = srv.getNextConnection();
        var max = moment(nextConn.from.departure);

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
        getNextConnectionInMinutes: function(options){
            return srv.getNextConnectionInMinutes();
        },
        getNextConnectionInMinutesText: function(options){
            return srv.getNextConnectionInMinutesText();
        },
        queryLocations:function(query, type){
            return srv.queryLocations(query,type);
        },
    };
});