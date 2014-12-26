
(function(){
    var controllers = angular.module('controllers', ['services']);
    
    controllers.controller("FilesController", ['$http', '$routeParams', '$location', 'filesService', 'movieModalService', 'undefinedModalService', function ($http, $routeParams, $location, filesService, movieModalService, undefinedModalService) {
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
        
            filesService.getFolderTypeAndItems(ctrl.currentDir, function(error, result){
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
        
        ctrl.goToParent = function(){
            $location.path('/library' + ctrl.parentDir);
        }
        
        ctrl.clickItem = function(item){
            if(item.isDir){
                $location.path('/library' + item.url);
            }else{
                if(ctrl.folderType == 'Movies'){
                    movieModalService.loadMovieInfo(item.name, item.url, function(){
                        $('#movie-info-modal').modal('show');    
                    } );
                }else{
                    undefinedModalService.fileName = item.name;
                    undefinedModalService.fileUrl = item.url;
                    $('#undefined-info-modal').modal('show');  
                }
            }
        }
        
        ctrl.load();
    }]);
})();