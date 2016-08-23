var __extends = (this && this.__extends) || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
};
var GrafikaApp;
(function (GrafikaApp) {
    var ApiService = (function (_super) {
        __extends(ApiService, _super);
        function ApiService(appCommon, $http) {
            _super.call(this, appCommon);
            this.$http = $http;
        }
        ApiService.prototype.get = function (path) {
            var _this = this;
            return this.$http.get(this.url(path))
                .error(function (data, status, headers, config) {
                return _this.log(data, status, headers, config);
            });
        };
        ApiService.prototype.post = function (path, data) {
            var _this = this;
            return this.$http.post(this.url(path), data)
                .error(function (data, status, headers, config) {
                return _this.log(data, status, headers, config);
            });
        };
        ApiService.prototype.put = function (path, data) {
            var _this = this;
            return this.$http.put(this.url(path), data)
                .error(function (data, status, headers, config) {
                return _this.log(data, status, headers, config);
            });
        };
        ApiService.prototype.delete = function (path) {
            var _this = this;
            return this.$http.delete(this.url(path))
                .error(function (data, status, headers, config) {
                return _this.log(data, status, headers, config);
            });
        };
        ApiService.prototype.url = function (path) {
            return this.appCommon.appConfig.apiBaseUrl + path;
        };
        ApiService.prototype.log = function (data, status, headers, config) {
            var deferred = this.appCommon.$q.defer();
            if (status == 401 || status == 403 || status == 0) {
                this.appCommon.hideLoadingModal();
            }
            this.appCommon.$log.error(config.method + ': ' + config.url + ' (' + status + ')');
            deferred.resolve();
            return deferred.promise;
        };
        ApiService.$inject = ['appCommon', '$http'];
        return ApiService;
    }(GrafikaApp.BaseService));
    GrafikaApp.ApiService = ApiService;
})(GrafikaApp || (GrafikaApp = {}));
//# sourceMappingURL=api-service.js.map