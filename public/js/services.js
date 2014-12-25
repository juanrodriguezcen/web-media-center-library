
(function(){
    var services = angular.module('services', []);

    services.service('apiService', ['$http', function($http){
    
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
    
})();