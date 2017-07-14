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
    var AnimationService = (function (_super) {
        __extends(AnimationService, _super);
        function AnimationService(appCommon, authService, apiService, resourceService) {
            var _this = _super.call(this, appCommon) || this;
            _this.authService = authService;
            _this.apiService = apiService;
            _this.resourceService = resourceService;
            return _this;
        }
        AnimationService.prototype.create = function (anim) {
            return this.apiService.post('animations', anim);
        };
        AnimationService.prototype.list = function (paging) {
            var _this = this;
            if (!paging)
                paging = new GrafikaApp.Paging();
            return this.apiService.get('animations' + paging.toQueryString())
                .then(function (res) { return _this.injectResources(res); });
        };
        AnimationService.prototype.get = function (_id) {
            var _this = this;
            return this.apiService.get('animations/' + _id)
                .then(function (res) { return _this.injectResources(res); });
        };
        AnimationService.prototype.getRandom = function () {
            var _this = this;
            return this.apiService.get('animations/random')
                .then(function (res) { return _this.injectResources(res); });
        };
        AnimationService.prototype.getRelated = function (_id, count) {
            var _this = this;
            if (count === void 0) { count = 5; }
            return this.apiService.get('animations/' + _id + '/related?count=' + count)
                .then(function (res) { return _this.injectResources(res); });
        };
        AnimationService.prototype.delete = function (_id) {
            return this.apiService.delete('animations/' + _id);
        };
        AnimationService.prototype.update = function (anim) {
            return this.apiService.put('animations/' + anim._id, anim);
        };
        AnimationService.prototype.postNewComment = function (anim, comment) {
            return this.apiService.post('animations/' + anim._id + '/comments', comment);
        };
        AnimationService.prototype.incrementViewCount = function (anim) {
            return this.apiService.post('animations/' + anim._id + '/view');
        };
        AnimationService.prototype.rate = function (animationId, rating) {
            return this.apiService.post('animations/' + animationId + '/rating/' + rating);
        };
        AnimationService.prototype.getDownloadLink = function (anim) {
            return this.appCommon.getBaseUrl() + 'animations/' + anim._id + '/download?token=' + this.authService.getAccessToken();
        };
        AnimationService.prototype.injectResources = function (res) {
            var _this = this;
            if (angular.isArray(res.data)) {
                var anims = res.data;
                anims.forEach(function (anim) { return _this.fixedResourceUrls(anim); });
            }
            else {
                this.fixedResourceUrls(res.data);
            }
            return this.appCommon.$q.when(res);
        };
        AnimationService.prototype.fixedResourceUrls = function (anim) {
            var _this = this;
            if (anim.resources) {
                anim.resources.forEach(function (res) {
                    var resource = res;
                    if (resource.type == 'background-image' && (!resource.base64)) {
                        resource.url = _this.appCommon.appConfig.apiBaseUrl + 'animations/' + anim._id + '/resources/' + resource.id;
                    }
                });
            }
            anim.thumbnailUrl = this.resourceService.getThumbnailUrl(anim);
        };
        return AnimationService;
    }(GrafikaApp.BaseService));
    AnimationService.$inject = ['appCommon', 'authService', 'apiService', 'resourceService'];
    GrafikaApp.AnimationService = AnimationService;
})(GrafikaApp || (GrafikaApp = {}));
//# sourceMappingURL=C:/Users/ricky/GrafikaProject/grafika.server/Grafika.WebSite/Tempaltes/GrafikaApp/output/services/animation-service.js.map