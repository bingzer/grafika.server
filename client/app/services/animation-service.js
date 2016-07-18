var __extends = (this && this.__extends) || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
};
var GrafikaApp;
(function (GrafikaApp) {
    var AnimationService = (function (_super) {
        __extends(AnimationService, _super);
        function AnimationService(appCommon, authService, apiService, resourceService) {
            _super.call(this, appCommon);
            this.authService = authService;
            this.apiService = apiService;
            this.resourceService = resourceService;
        }
        AnimationService.prototype.create = function (anim) {
            return this.apiService.post('animations', anim);
        };
        AnimationService.prototype.list = function (paging) {
            var _this = this;
            if (!paging)
                paging = new GrafikaApp.Paging();
            return this.apiService.get('animations' + paging.toQueryString()).then(function (res) {
                res.data.forEach(function (anim) {
                    anim.thumbnailUrl = _this.resourceService.getThumbnailUrl(anim);
                });
                return _this.appCommon.$q.when(res);
            });
        };
        AnimationService.prototype.get = function (_id) {
            var _this = this;
            return this.apiService.get('animations/' + _id).then(function (res) {
                res.data.thumbnailUrl = _this.resourceService.getThumbnailUrl(res.data);
                return _this.appCommon.$q.when(res);
            });
        };
        AnimationService.prototype.delete = function (_id) {
            return this.apiService.delete('animations/' + _id);
        };
        AnimationService.prototype.update = function (anim) {
            var _this = this;
            return this.apiService.put('animations/' + anim._id, anim).then(function (res) {
                res.data.thumbnailUrl = _this.resourceService.getThumbnailUrl(res.data);
                return _this.appCommon.$q.when(res);
            });
        };
        AnimationService.prototype.incrementViewCount = function (anim) {
            return this.apiService.post('animations/' + anim._id + '/view');
        };
        AnimationService.prototype.getDownloadLink = function (anim) {
            return this.appCommon.getBaseUrl() + 'animations/' + anim._id + '/download?token=' + this.authService.getAccessToken();
        };
        AnimationService.$inject = ['appCommon', 'authService', 'apiService', 'resourceService'];
        return AnimationService;
    }(GrafikaApp.BaseService));
    GrafikaApp.AnimationService = AnimationService;
})(GrafikaApp || (GrafikaApp = {}));
//# sourceMappingURL=animation-service.js.map