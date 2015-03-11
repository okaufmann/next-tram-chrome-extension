var nextTramDirectives = angular.module('NextTramDirectives',[]);

nextTramDirectives.directive('sectionList', function () {
    return {
        restrict: 'EA', //E = element, A = attribute, C = class, M = comment         
        scope: {
            //@ reads the attribute value, = provides two-way binding, & works with functions
            sections: '@'
        },
        templateUrl: 'partials/sectionList.html',
        //controller: controllerFunction, //Embed a custom controller in the directive
        link: function ($scope, element, attrs) { 
    		console.log($scope.sections.length);
        } //DOM manipulation
    };
}); 