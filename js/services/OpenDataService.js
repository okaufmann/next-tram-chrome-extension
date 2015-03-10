'use strict';

var nextTramOpendataService = angular.module('NextTramOpenDataService', []);

nextTramOpendataService.factory('OpenDataService', function($http, $filter) {
    var srv = {};

    srv._baseUrl = "http://transport.opendata.ch/v1/";

    srv.getConnections = function(from, to, time, date){
        
        if(time == undefined){
            time = null;
        }

        if(date == undefined){
            date = null;
        }
        
        from = encodeURI(from);
        to = encodeURI(to);
        time = encodeURI(time);
        date = encodeURI(date);

        var url = srv._baseUrl + 'connections?from=' + from + "&to=" + to+ "&limit=6&time="+ time+ "&date=" + date;
        console.log("fetching new connections from ", url);

        return $http.get(url);
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
        getConnections:  function(from,to, time, date){
            return srv.getConnections(from,to);
        },
        queryLocations:function(query, type){
            return srv.queryLocations(query,type);
        },
    };
});