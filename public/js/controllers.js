
(function(){
    var controllers = angular.module('controllers', []);
    
    var baseFilesApiUrl = '/api/files';
    var baseTouchApiUrl = '/api/touch';

    controllers.controller("FilesController", ['$http', '$routeParams', '$location', function ($http, $routeParams, $location) {
        var ctrl = this;
        ctrl.filesOrDirs = [];
        ctrl.currentDir = '';
        ctrl.parentDir = '///';
        ctrl.itemToConfirm = '';
        
    
        ctrl.load = function() {
            if($routeParams.path){
                ctrl.currentDir = '/' + $routeParams.path;
            }
        
            $http.get(baseFilesApiUrl + ctrl.currentDir).
                success(function(data, status, headers, config) {
                    ctrl.filesOrDirs = data.sort(function (a, b) {
                        if (a.isDir && !b.isDir) {
                            return -1;
                        } else if (!a.isDir && b.isDir) {
                            return 1;
                        } else if (a.name.toLowerCase() >= b.name.toLowerCase()) {
                            return 1;
                        } else {
                            return -1;
                        }
                    });

                    if (ctrl.currentDir != '') {
                        ctrl.parentDir = ctrl.currentDir.replace(/\/[^\/]+$/, "");
                    } else {
                        ctrl.parentDir = '///';
                    }

                }).
                error(function(data, status, headers, config) {
                  // log error
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
            $http.post(baseTouchApiUrl + ctrl.itemToConfirm.url).
                success(function (data, status, headers, config) {
                    $('#myModal').modal('hide');
                });
        }
        
        ctrl.load();

    }]);

})();