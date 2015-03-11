var nextTramDirectives = angular.module('NextTramDirectives',[]);

nextTramDirectives.directive('productList', function () {
    return {
        restrict: 'EA', //E = element, A = attribute, C = class, M = comment         
        scope: {
            products: '='
        },
        templateUrl: 'partials/productList.html',
        link: function ($scope, element, attrs) { 
    		//console.log($scope.products);
        } 
    };
}); 