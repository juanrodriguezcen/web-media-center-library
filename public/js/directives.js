
(function(){
    var directives = angular.module('directives', ['services']);
   
    
    directives.directive("fileInfoModal", ['fileInfoModalService', 'filesService', function (fileInfoModalService, filesService) {
        return {
          restrict: 'E',
          templateUrl: '/partials/file-info-modal.html',
          controller: function(){
            var ctrl = this; 
            ctrl.service = fileInfoModalService;
            
            ctrl.touchFile = function(){
                $('.modal-touch-button').button('loading');
                filesService.touchFile(fileInfoModalService.item.url, function(error){
                    $('.modal-touch-button').button('reset');
                });
            }
          },
          controllerAs: "fileInfoModalCtrl"
        };
    }]);
    
    
})();


