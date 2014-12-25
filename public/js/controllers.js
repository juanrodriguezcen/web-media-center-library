
(function(){
    var controllers = angular.module('controllers', ['services']);
    
    controllers.controller("FilesController", ['$http', '$routeParams', '$location', 'apiService', function ($http, $routeParams, $location, apiService) {
        var ctrl = this;
        ctrl.filesOrDirs = [];
        ctrl.folderType = '';
        ctrl.currentDir = '';
        ctrl.parentDir = '///';
        ctrl.itemToConfirm = '';
        
    
        ctrl.load = function() {
            if($routeParams.path){
                ctrl.currentDir = '/' + $routeParams.path;
            }
        
            apiService.getFolderTypeAndItems(ctrl.currentDir, function(error, result){
                if(!error){
                    ctrl.folderType = result.folderType;
                    ctrl.filesOrDirs = result.items;
                    
                    if (ctrl.currentDir != '') {
                        ctrl.parentDir = ctrl.currentDir.replace(/\/[^\/]+$/, "");
                    } else {
                        ctrl.parentDir = '///';
                    }
                }
            });
        }
        
        ctrl.goToFolder = function(folder){
            $location.path('/library' + folder);
        }
        

        ctrl.confirmTouchFile = function (item){
            ctrl.itemToConfirm = item;
            $('#myModal').modal('show');
        }

        ctrl.touchFile = function () {
            apiService.touchFile(ctrl.itemToConfirm.url, function(error){
                $('#myModal').modal('hide');
            });
        }
        
        ctrl.load();
    }]);
})();