var nextTramOpendataService = angular.module('NextTramOptionsService', 
	['chromeStorage']
);

nextTramOpendataService.factory('OptionsService', function($http, $filter, chromeStorage, $q) {
    var srv = {};

    srv.getOptions = function(){
        return chromeStorage.get('options');
    };

    srv.setOptions = function(optionsObj){
       return chromeStorage.set('options', optionsObj);
    }

    srv.addConnection = function(connection){
        var deferred = $q.defer();
        chromeStorage.get('options').then(function(options){
            if(options != null){

                if(options.connections == undefined || options.connections == null){
                    options.connections = [];
                }

                options.connections.push(connection);

                deferred.resolve(options.connections);
            }
        });
        return deferred.promise;
    };
    srv.setConnection = function(index,connection){
        var deferred = $q.defer();
        chromeStorage.get('options').then(function(options){
            if(options != null){
                if(options.connections[index] == undefined){
                    options.connections = [];
                    options.connections.push(connection);
                }else{
                    options.connections[index] = connection;
                }

                deferred.resolve(options.connections);
            }
        });
        return deferred.promise;
    };
    srv.removeConnection = function(index){
        var deferred = $q.defer();
        chromeStorage.get('options').then(function(options){
            if(options != null){
                if(options.connections[index] != undefined){
                    options.connections.splice(index, 1);
                }
                deferred.resolve(options.connections);
            }
        });
        return deferred.promise;
    };
    srv.getConnections = function(){
        var deferred = $q.defer();
        chromeStorage.get('options').then(function(options){
            if(options != null){
                if(options.connections != undefined && options.connections != null){
                    deferred.resolve(options.connections);
                }else{
                    deferred.resolve([]);
                }
            }
        });
        return deferred.promise;
    };

    return {
    	getOptions:function(){
            return srv.getOptions();
        },
        setOptions:function(optionsObj){
            srv.setOptions(optionsObj);
        }
    };
});