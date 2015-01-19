var nextTramOpendataService = angular.module('NextTramOptionsService', 
	['chromeStorage']
);

nextTramOpendataService.factory('OptionsService', function($http, $filter, chromeStorage, $q) {
    var srv = {};

    srv.getOptions = function(){
        return chromeStorage.get('options');
    };

    srv.setOptions = function(optionsObj){
       chromeStorage.set('options', optionsObj);
    }

    srv.addConnection = function(connection){
        chromeStorage.get('options').then(function(options){
            if(options != null){

                if(options.connections == undefined || options.connections == null){
                    options.connections = [];
                }

                options.connections.push(connection);
            }
        });
    };
    srv.setConnection = function(index,connection){
        chromeStorage.get('options').then(function(options){
            if(options != null){
                if(options.connections[index] == undefined){
                    options.connections = [];
                    options.connections.push(connection);
                }else{
                    options.connections[index] = connection;
                }
            }
        });
    };
    srv.removeConnection = function(index){
        chromeStorage.get('options').then(function(options){
            if(options != null){
                if(options.connections[index] != undefined){
                    options.connections.splice(index, 1);
                }
            }
        });
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