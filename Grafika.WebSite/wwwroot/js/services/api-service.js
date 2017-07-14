var __extends = (this && this.__extends) || (function () {
    var extendStatics = Object.setPrototypeOf ||
        ({ __proto__: [] } instanceof Array && function (d, b) { d.__proto__ = b; }) ||
        function (d, b) { for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p]; };
    return function (d, b) {
        extendStatics(d, b);
        function __() { this.constructor = d; }
        d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
    };
})();
var GrafikaApp;
(function (GrafikaApp) {
    var ApiService = (function (_super) {
        __extends(ApiService, _super);
        function ApiService(appCommon, $http) {
            var _this = _super.call(this, appCommon) || this;
            _this.$http = $http;
            return _this;
        }
        ApiService.prototype.getStatus = function () {
            return this.get('');
        };
        ApiService.prototype.get = function (path) {
            var _this = this;
            return this.$http.get(this.url(path))
                .catch(function (reason) { return _this.log(reason); });
        };
        ApiService.prototype.post = function (path, data) {
            var _this = this;
            return this.$http.post(this.url(path), data)
                .catch(function (reason) { return _this.log(reason); });
        };
        ApiService.prototype.put = function (path, data) {
            var _this = this;
            return this.$http.put(this.url(path), data)
                .catch(function (reason) { return _this.log(reason); });
        };
        ApiService.prototype.delete = function (path) {
            var _this = this;
            return this.$http.delete(this.url(path))
                .catch(function (reason) { return _this.log(reason); });
        };
        ApiService.prototype.url = function (path) {
            return this.appCommon.appConfig.apiBaseUrl + path;
        };
        ApiService.prototype.log = function (reason) {
            var status = reason.status;
            var config = reason.config;
            if (status == 401 || status == 403 || status == 0) {
                this.appCommon.hideLoadingModal();
                //this.appCommon.navigate('/');
            }
            this.appCommon.$log.error(config.method + ': ' + config.url + ' (' + status + ')');
            return this.appCommon.$q.reject();
        };
        ApiService.$inject = ['appCommon', '$http'];
        return ApiService;
    }(GrafikaApp.BaseService));
    GrafikaApp.ApiService = ApiService;
})(GrafikaApp || (GrafikaApp = {}));
