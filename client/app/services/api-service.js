(function (angular, app) {
    app.factory('apiService', ['$http', 'appCommon', function ($http, appCommon) {
        return {
            get: function (path) {
                return $http.get(url(path)).error(log);
            },
            post: function (path, data) {
                return $http.post(url(path), data).error(log);
            },
            put: function (path, data) {
                return $http.put(url(path), data).error(log);
            },
            delete: function (path) {
                return $http.delete(url(path)).error(log);
            }
        }

        function url(path) {
            return appCommon.appConfig.apiBaseUrl + path;
        }

        function log(data, status, headers, config) {
            if (status == 401 || status == 403 || status == 0) {
                //authService.clearToken();
                appCommon.navigate('/');
            } else {
                appCommon.$log.error(config.method + ': ' + config.url + ' (' + status + ')');
            }
        }
    }]);
})(window.angular, window.angular.app);
