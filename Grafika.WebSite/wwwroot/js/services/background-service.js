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
    var BackgroundService = (function (_super) {
        __extends(BackgroundService, _super);
        function BackgroundService(appCommon, authService, apiService, resourceService) {
            var _this = _super.call(this, appCommon) || this;
            _this.authService = authService;
            _this.apiService = apiService;
            _this.resourceService = resourceService;
            return _this;
        }
        BackgroundService.prototype.create = function (background) {
            return this.apiService.post('background', background);
        };
        BackgroundService.prototype.list = function (paging) {
            var _this = this;
            if (!paging)
                paging = new GrafikaApp.Paging();
            return this.apiService.get('backgrounds' + paging.toQueryString())
                .then(function (res) { return _this.injectResources(res); });
        };
        BackgroundService.prototype.get = function (_id) {
            var _this = this;
            return this.apiService.get('backgrounds/' + _id)
                .then(function (res) { return _this.injectResources(res); });
        };
        BackgroundService.prototype.delete = function (_id) {
            return this.apiService.delete('backgrounds/' + _id);
        };
        BackgroundService.prototype.update = function (background) {
            return this.apiService.put('backgrounds/' + background._id, background);
        };
        BackgroundService.prototype.getFrames = function (background) {
            return this.apiService.get('backgrounds/' + background._id + '/frames');
        };
        BackgroundService.prototype.updateFrames = function (background, data) {
            return this.apiService.post('backgrounds/' + background._id + '/frames', data);
        };
        BackgroundService.prototype.injectResources = function (res) {
            var _this = this;
            if (angular.isArray(res.data)) {
                var backgrounds = res.data;
                backgrounds.forEach(function (background) { return _this.fixedResourceUrls(background); });
            }
            else {
                this.fixedResourceUrls(res.data);
            }
            return this.appCommon.$q.when(res);
        };
        BackgroundService.prototype.fixedResourceUrls = function (background) {
            background.thumbnailUrl = this.resourceService.getThumbnailUrl(background);
        };
        BackgroundService.$inject = ['appCommon', 'authService', 'apiService', 'resourceService'];
        return BackgroundService;
    }(GrafikaApp.BaseService));
    GrafikaApp.BackgroundService = BackgroundService;
})(GrafikaApp || (GrafikaApp = {}));
