var GrafikaApp;
(function (GrafikaApp) {
    var ResourceService = (function () {
        function ResourceService(appCommon, authService, apiService) {
            this.appCommon = appCommon;
            this.authService = authService;
            this.apiService = apiService;
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
                data: blob
            };
            return this.apiService.$http(req);
        };
        ResourceService.prototype.getResourceUrl = function (anim, resource) {
            var resourceId = resource;
            if (resource instanceof Grafika.IResource)
                resourceId = resource._id;
            return this.appCommon.appConfig.animationBaseUrl + anim._id + '/' + resourceId;
        };
        ResourceService.prototype.getThumbnailUrl = function (anim) {
            return this.appCommon.appConfig.apiBaseUrl + 'animations/' + anim._id + '/thumbnail';
        };
        ResourceService.prototype.saveThumbnail = function (anim) {
            return this.apiService.post('animations/' + anim._id + '/thumbnail');
        };
        ResourceService.$inject = [
            'appCommon',
            'authService',
            'apiService'
        ];
        return ResourceService;
    }());
    GrafikaApp.ResourceService = ResourceService;
})(GrafikaApp || (GrafikaApp = {}));
//# sourceMappingURL=resource-service.js.map