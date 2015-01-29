var nextTramOpendataService = angular.module('NextTramOptionsService', 	[
    'chromeStorage',
    'angularUUID2'
]);

nextTramOpendataService.factory('OptionsService', function($http, $filter, chromeStorage, $q,uuid2) {
    var srv = {};

    srv.getOptions = function(){
        return chromeStorage.get('options');
    };

    srv.setOptions = function(optionsObj){
       return chromeStorage.set('options', optionsObj);
    }

    srv.addConnection = function(connection){
        var deferred = $q.defer();
        var options = {};
        chromeStorage.get('options').then(function(options){
            console.log("about to add the connection");
            if(options == null){
                options = {};
            }

            if(options.connections == undefined || options.connections == null){
                options.connections = new Array();
            }
            //create unique id
            var guid = uuid2.newguid();
            connection.id = guid;

            options.connections.push(connection);
            console.log(options.connections);
            deferred.resolve(options);
            srv.setOptions(options);
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
    srv.removeConnection = function(connection){
        var deferred = $q.defer();
        chromeStorage.get('options').then(function(options){
            if(options != null){
                //options.connections = [];
                var index = options.connections.indexOf(connection)
                options.connections.splice(index, 1);
                srv.setOptions(options);
                deferred.resolve(options);
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
            return srv.setOptions(optionsObj);
        },
        addConnection:function(connection){
            return srv.addConnection(connection);
        },
        setConnection:function(index,connection){
            return srv.setConnection(index,connection);
        },
        removeConnection:function(index){
            return srv.removeConnection(index);
        },
        getConnections:function(){
            return srv.getConnections();
        }
    };
});