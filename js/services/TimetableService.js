'use strict';

var nextTramTimeTableService = angular.module('NextTramTimeTableService', []);

nextTramTimeTableService.factory('TimeTableService', function($http, $filter) {
	var srv = {};

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

	srv.getLocalConnections = function() {
        return angular.fromJson(localStorage['connections']);
    };

    srv.setLocalConnections = function(connections) {
        localStorage['connections'] = angular.toJson(connections);
    };

    return {
    	getLocalConnections:  function(){
            return srv.getLocalConnections();
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
    };
});