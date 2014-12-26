
(function(){
    var controllers = angular.module('controllers', ['services']);
    
    controllers.controller("FilesController", ['$http', '$routeParams', '$location', 'filesService', 'fileInfoModalService', function ($http, $routeParams, $location, filesService, fileInfoModalService) {
        var ctrl = this;
        ctrl.filesOrDirs = [];
        ctrl.currentDir = '';
        ctrl.parentDir = '///';
        
    
        ctrl.load = function() {
            if($routeParams.path){
                ctrl.currentDir = '/' + $routeParams.path;
            }
        
            filesService.getFolderTypeAndItems(ctrl.currentDir, function(error, result){
                if(!error){
                    ctrl.filesOrDirs = result.items;
                    
                    if (ctrl.currentDir != '') {
                        ctrl.parentDir = ctrl.currentDir.replace(/\/[^\/]+$/, "");
                    } else {
                        ctrl.parentDir = '///';
                    }
                }
            });
        }
        
        ctrl.goToParent = function(){
            $location.path('/library' + ctrl.parentDir);
        }
        
        ctrl.clickItem = function(item){
            if(item.isDir){
                $location.path('/library' + item.url);
            }else{
                fileInfoModalService.loadFileInfo(item, function(error){
                    if(!error){
                        if(fileInfoModalService.fileInfo && fileInfoModalService.fileInfo.type == 'Movie'){
                            $('#movie-info-modal').modal('show');  
                        }else if(fileInfoModalService.fileInfo && fileInfoModalService.fileInfo.type == 'Series'){
                            $('#series-info-modal').modal('show');  
                        }else{
                            $('#undefined-info-modal').modal('show');  
                        }
                    }else{
                        $('#undefined-info-modal').modal('show');  
                    }
                });
            }
        }
        
        ctrl.load();
    }]);
})();