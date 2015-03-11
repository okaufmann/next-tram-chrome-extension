var nextTramDirectives = angular.module('NextTramDirectives',[]);

nextTramDirectives.directive('productList', function () {
    return {
        restrict: 'EA', //E = element, A = attribute, C = class, M = comment         
        scope: {
            //@ reads the attribute value, = provides two-way binding, & works with functions
            products: '='
        },
        templateUrl: 'partials/productList.html',
        //controller: controllerFunction, //Embed a custom controller in the directive
        link: function ($scope, element, attrs) { 
    		console.log($scope.products);
        } //DOM manipulation
    };
}); 