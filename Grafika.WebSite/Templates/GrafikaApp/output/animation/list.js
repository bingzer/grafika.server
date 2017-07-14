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
    var AnimationListController = (function (_super) {
        __extends(AnimationListController, _super);
        function AnimationListController(appCommon, animationService, authService) {
            var _this = _super.call(this, appCommon) || this;
            _this.animationService = animationService;
            _this.authService = authService;
            _this.hasMore = true;
            _this.busy = false;
            _this.animationSorts = appCommon.appConfig.animationSorts;
            _this.paging = _this.createPaging();
            _this.list();
            return _this;
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
                _this.hasMore = res.data.length >= _this.paging.limit;
                if (_this.hasMore)
                    _this.paging = _this.paging.next();
            })
                .catch(function (reason) { return _this.appCommon.toast(_this.appCommon.formatErrorMessage(reason)); })
                .finally(function () { return _this.busy = false; });
        };
        AnimationListController.prototype.reset = function () {
            this.paging = this.createPaging();
            this.list();
        };
        AnimationListController.prototype.canEdit = function () {
            return false;
        };
        AnimationListController.prototype.canDelete = function () {
            return false;
        };
        AnimationListController.prototype.createPaging = function () {
            return new GrafikaApp.Paging({ isPublic: true, limit: this.appCommon.appConfig.fetchSize, skip: 0, sort: this.appCommon.appConfig.animationSorts[0].key });
        };
        return AnimationListController;
    }(GrafikaApp.BaseController));
    AnimationListController.$inject = ['appCommon', 'animationService', 'authService'];
    GrafikaApp.AnimationListController = AnimationListController;
})(GrafikaApp || (GrafikaApp = {}));
//# sourceMappingURL=C:/Users/ricky/GrafikaProject/grafika.server/Grafika.WebSite/Tempaltes/GrafikaApp/output/animation/list.js.map