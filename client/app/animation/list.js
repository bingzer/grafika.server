var __extends = (this && this.__extends) || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
};
var GrafikaApp;
(function (GrafikaApp) {
    var AnimationListController = (function (_super) {
        __extends(AnimationListController, _super);
        function AnimationListController(appCommon, animationService, authService) {
            _super.call(this, appCommon);
            this.animationService = animationService;
            this.authService = authService;
            this.hasMore = true;
            this.busy = false;
            this.paging = this.createPaging();
            this.list();
        }
        AnimationListController.prototype.list = function (append) {
            var _this = this;
            if (!append)
                this.paging.skip = 0;
            this.busy = true;
            this.animationService.list(this.paging).then(function (res) {
                if (!append)
                    _this.animations = res.data;
                else
                    _this.animations = _this.animations.concat(res.data);
                _this.busy = false;
                _this.hasMore = res.data.length >= _this.paging.limit;
                if (_this.hasMore)
                    _this.paging = _this.paging.next();
            });
        };
        AnimationListController.prototype.canEdit = function () {
            return false;
        };
        AnimationListController.prototype.canDelete = function () {
            return false;
        };
        AnimationListController.prototype.createPaging = function () {
            return new GrafikaApp.Paging({ isPublic: true, limit: this.appCommon.appConfig.fetchSize, skip: 0 });
        };
        AnimationListController.$inject = ['appCommon', 'animationService', 'authService'];
        return AnimationListController;
    }(GrafikaApp.BaseController));
    GrafikaApp.AnimationListController = AnimationListController;
})(GrafikaApp || (GrafikaApp = {}));
//# sourceMappingURL=list.js.map