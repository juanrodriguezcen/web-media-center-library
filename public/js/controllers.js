
(function(){
    var controllers = angular.module('controllers', []);
    
    var baseFilesApiUrl = '/api/files';
    var baseTouchApiUrl = '/api/touch';

    controllers.controller("FilesController", ['$http', function ($http) {
        var ctrl = this;
        ctrl.filesOrDirs = [];
        ctrl.currentDir = '';
        ctrl.parentDir = '///';
        ctrl.itemToConfirm = '';
    
        ctrl.getFilesAndDirs = function (folderUrl) {
            $http.get(baseFilesApiUrl + folderUrl).
                success(function(data, status, headers, config) {
                    ctrl.filesOrDirs = data.sort(function (a, b) {
                        if (a.is_dir && !b.is_dir) {
                            return -1;
                        } else if (!a.is_dir && b.is_dir) {
                            return 1;
                        } else if (a.name.toLowerCase() >= b.name.toLowerCase()) {
                            return 1;
                        } else {
                            return -1;
                        }
                    });

                    if (folderUrl != '') {
                        ctrl.parentDir = folderUrl.replace(/\/[^\/]+$/, "");
                    } else {
                        ctrl.parentDir = '///';
                    }
                    
                    if(folderUrl == ''){
                        ctrl.currentDir = '/';
                    }else{
                        ctrl.currentDir = folderUrl;
                    }
                }).
                error(function(data, status, headers, config) {
                  // log error
                });
        }

        ctrl.openDir = function (item) {
            if (item.is_dir) {
                getFilesAndDirs(item.url);

            }
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
        
        ctrl.getFilesAndDirs('');

    }]);

})();