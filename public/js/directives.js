
(function(){
    var directives = angular.module('directives', ['services']);
   
    
    directives.directive("movieModal", ['movieModalService', 'filesService', function (movieModalService, filesService) {
        return {
          restrict: 'E',
          templateUrl: '/partials/movie-modal.html',
          controller: function(){
            var ctrl = this; 
            ctrl.movieInfoService = movieModalService;
            
            ctrl.touchFile = function(){
                $('#movie-modal-touch-button').button('loading');
                filesService.touchFile(movieModalService.item.url, function(error){
                    $('#movie-modal-touch-button').button('reset');
                });
            }
          },
          controllerAs: "movieModalCtrl"
        };
    }]);
    
    directives.directive("undefinedModal", ['undefinedModalService', 'filesService', function (undefinedModalService, filesService) {
        return {
          restrict: 'E',
          templateUrl: '/partials/undefined-modal.html',
          controller: function(){
            var ctrl = this; 
            ctrl.service = undefinedModalService;
            
            ctrl.touchFile = function(){
                $('#undefined-modal-touch-button').button('loading');
                filesService.touchFile(undefinedModalService.item.url, function(error){
                    $('#undefined-modal-touch-button').button('reset');
                });
            }
          },
          controllerAs: "undefinedModalCtrl"
        };
    }]);
    
})();


