

(function(){
    var app = angular.module("raspiDLNA", ['ngRoute', 'controllers']);
    
    app.config(['$routeProvider',
      function($routeProvider) {
        $routeProvider.
          when('/library/:path*?', {
            templateUrl: '/partials/folder-content.html',
            controller: 'FilesController',
            controllerAs: 'filesCtrl'
          }).
          otherwise({
            redirectTo: '/library/'
          });
      }
    ]);
})();
