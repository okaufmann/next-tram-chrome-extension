var nextTramOpendataService = angular.module('NextTramOptionsService', 
	['chromeStorage']
);

nextTramOpendataService.factory('OptionsService', function($http, $filter, chromeStorage) {
    var srv = {};

    srv.getOptions = function(){
        var optionsStorage = chromeStorage.get("options");
        var optionsObj = {};

        return chromeStorage.get('options');
    };

    srv.setOptions = function(optionsObj){
       chromeStorage.set('options', optionsObj);
    }

    return {
    	getOptions:function(){
            return srv.getOptions();
        },
        setOptions:function(optionsObj){
            srv.setOptions(optionsObj);
        }
    };
});