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
    var ResourceService = (function (_super) {
        __extends(ResourceService, _super);
        function ResourceService(appCommon, authService, apiService) {
            var _this = _super.call(this, appCommon) || this;
            _this.authService = authService;
            _this.apiService = apiService;
            return _this;
        }
        ResourceService.prototype.list = function (anim) {
            return this.apiService.get('animations/' + anim._id + '/resources/');
        };
        ResourceService.prototype.get = function (anim, resourceId) {
            return this.apiService.get('animations/' + anim._id + '/resources/' + resourceId);
        };
        ResourceService.prototype.del = function (anim, resourceId) {
            return this.apiService.delete('animations/' + anim._id + '/resources/' + resourceId);
        };
        ResourceService.prototype.create = function (anim, resource) {
            return this.apiService.post('animations/' + anim._id + '/resources/', resource);
        };
        ResourceService.prototype.upload = function (data, blob) {
            if (!data.mime || !data.signedUrl)
                throw new Error('Expecting data.mime && data.signedUrl');
            var req = {
                method: 'PUT',
                url: data.signedUrl,
                cors: true,
                headers: {
                    'Authorization': undefined,
                    'Content-Type': data.mime,
                    'x-amz-acl': 'public-read',
                },
                data: blob.blob
            };
            return this.apiService.$http(req);
        };
        ResourceService.prototype.getResourceUrl = function (entity, resource) {
            var resourceId = resource;
            if (resource && resource.id)
                resourceId = resource.id;
            return this.appCommon.appConfig.apiBaseUrl + this.resourcePath(entity) + entity._id + '/resources/' + resourceId;
        };
        ResourceService.prototype.saveResource = function (entity, resource) {
            return this.apiService.post(this.resourcePath(entity) + entity._id + '/resources', resource);
        };
        ResourceService.prototype.getThumbnailUrl = function (entity) {
            return this.appCommon.appConfig.apiBaseUrl + this.resourcePath(entity) + entity._id + '/thumbnail';
        };
        ResourceService.prototype.saveThumbnail = function (entity) {
            return this.apiService.post(this.resourcePath(entity) + entity._id + '/thumbnail');
        };
        ResourceService.prototype.resourcePath = function (entity) {
            var path = "animations/";
            if (entity.type.toLowerCase() == "background")
                path = "backgrounds/";
            return path;
        };
        ResourceService.$inject = ['appCommon', 'authService', 'apiService'];
        return ResourceService;
    }(GrafikaApp.BaseService));
    GrafikaApp.ResourceService = ResourceService;
})(GrafikaApp || (GrafikaApp = {}));
//# sourceMappingURL=C:/Users/rtobings/GrafikaProject/grafika.server/Grafika.WebSite/Tempaltes/GrafikaApp/output/services/resource-service.js.map