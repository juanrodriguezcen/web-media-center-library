
(function(){
    var services = angular.module('services', []);

    services.service('filesService', ['$http', function($http){
    
        var baseFilesApiUrl = '/api/files';
        var baseTouchApiUrl = '/api/touch';
        
        this.getFolderTypeAndItems = function (folder, callback){
            
            $http.get(baseFilesApiUrl + folder).
                success(function(data, status, headers, config) {
                    var items = [];
                    items = data.items.sort(function (a, b) {
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

                    callback(null, { folderType: data.folderType, items: items});
                }).
                error(function(data, status, headers, config) {
                    callback('Error retrieving data from server');
                });
        }
        
        this.touchFile = function(itemToTouch, callback){
            $http.post(baseTouchApiUrl + itemToTouch).
                success(function (data, status, headers, config) {
                    callback();
                }).error(function(data, status, headers, config) {
                    callback('Error touching file on server');
                });
        }
    
    }]);
    
    services.service('movieModalService', ['$http', function($http){
        var svc = this;
        svc.movieFileName  = '';
        svc.movieUrl = '';
        svc.movieFileInfo = '';
        
        svc.loadMovieInfo = function(fileName, fileUrl, callback){
            svc.movieFileName = fileName;
            svc.movieUrl = fileUrl;
            svc.movieFileInfo = '';
            
            $http.get('/api/movie-info?filename=' + fileName).
                success(function (data, status, headers, config) {
                    if(status == 200){
                        svc.movieFileInfo = data;
                    }else{
                        svc.movieFileInfo = '';
                    }
                    callback();
                }).error(function(data, status, headers, config) {
                    callback('Error touching file on server');
                });
        }
    
    }]);
    
    services.service('undefinedModalService', ['$http', function($http){
        var svc = this;
        svc.fileName  = '';
        svc.fileUrl = '';
    }]);
    
})();