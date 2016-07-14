var GrafikaApp;
(function (GrafikaApp) {
    var AnimationService = (function () {
        function AnimationService(appCommon, authService, apiService) {
            this.appCommon = appCommon;
            this.authService = authService;
            this.apiService = apiService;
        }
        AnimationService.prototype.create = function (anim) {
            return this.apiService.post('animations', anim);
        };
        AnimationService.prototype.list = function (paging) {
            var _this = this;
            if (!paging)
                paging = this.createPaging();
            var query = this.createPagingQuery(paging);
            return this.apiService.get('animations' + query).then(function (res) {
                return _this.injectThumbnailUrl(res);
            });
        };
        AnimationService.prototype.get = function (_id) {
            var _this = this;
            return this.apiService.get('animations/' + _id).then(function (res) {
                return _this.injectThumbnailUrl(res);
            });
        };
        AnimationService.prototype.del = function (_id) {
            return this.apiService.delete('animations/' + _id);
        };
        AnimationService.prototype.update = function (anim) {
            var _this = this;
            return this.apiService.put('animations/' + anim._id, anim).then(function (res) {
                return _this.injectThumbnailUrl(res);
            });
        };
        AnimationService.prototype.incrementViewCount = function (anim) {
            return this.apiService.post('animations/' + anim._id + '/view');
        };
        AnimationService.prototype.getDownloadLink = function (anim) {
            return this.appCommon.getBaseUrl() + 'animations/' + anim._id + '/download?token=' + this.authService.getAccessToken();
        };
        AnimationService.prototype.injectThumbnailUrl = function (res) {
            return this.appCommon.$q.when(res);
        };
        AnimationService.prototype.createPaging = function (isPublic) {
            return {
                isPublic: isPublic || true,
                page: 0,
                count: this.appCommon.appConfig.fetchSize
            };
        };
        AnimationService.prototype.createPagingQuery = function (paging) {
            var query = '?';
            if (paging) {
                if (paging.userId)
                    query += '&userId=' + paging.userId;
                else
                    query += '&isPublic=true';
                if (paging.category)
                    query += '&category=' + paging.category;
                if (paging.sort)
                    query += '&sort=' + paging.sort;
                if (paging.count)
                    query += '&limit=' + paging.count;
                if (paging.page)
                    query += '&skip=' + paging.page;
                if (paging.query)
                    query += "&query=" + paging.query;
                if (paging.type)
                    query += "&type=" + paging.type;
            }
            return query;
        };
        AnimationService.$inject = [
            'appCommon',
            'authService',
            'apiService'
        ];
        return AnimationService;
    }());
    GrafikaApp.AnimationService = AnimationService;
})(GrafikaApp || (GrafikaApp = {}));
//# sourceMappingURL=animation-service.js.map