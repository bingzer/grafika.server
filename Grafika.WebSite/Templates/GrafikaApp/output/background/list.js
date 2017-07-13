var __extends = (this && this.__extends) || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
};
var GrafikaApp;
(function (GrafikaApp) {
    var BackgroundListController = (function (_super) {
        __extends(BackgroundListController, _super);
        function BackgroundListController(appCommon, backgroundService, authService) {
            var _this = _super.call(this, appCommon) || this;
            _this.backgroundService = backgroundService;
            _this.authService = authService;
            _this.hasMore = true;
            _this.busy = false;
            _this.paging = _this.createPaging();
            _this.list();
            return _this;
        }
        BackgroundListController.prototype.list = function (append) {
            var _this = this;
            if (!append)
                this.paging.skip = 0;
            this.busy = true;
            this.backgroundService.list(this.paging).then(function (res) {
                if (!append)
                    _this.backgrounds = res.data;
                else
                    _this.backgrounds = _this.backgrounds.concat(res.data);
                _this.hasMore = res.data.length >= _this.paging.limit;
                if (_this.hasMore)
                    _this.paging = _this.paging.next();
            })
                .catch(function (reason) { return _this.appCommon.toast(_this.appCommon.formatErrorMessage(reason)); })
                .finally(function () { return _this.busy = false; });
        };
        BackgroundListController.prototype.reset = function () {
            this.paging = this.createPaging();
            this.list();
        };
        BackgroundListController.prototype.canEdit = function () {
            return false;
        };
        BackgroundListController.prototype.canDelete = function () {
            return false;
        };
        BackgroundListController.prototype.createPaging = function () {
            return new GrafikaApp.Paging({ isPublic: true, limit: this.appCommon.appConfig.fetchSize, skip: 0, sort: this.appCommon.appConfig.animationSorts[0].key });
        };
        return BackgroundListController;
    }(GrafikaApp.BaseController));
    BackgroundListController.$inject = ['appCommon', 'backgroundService', 'authService'];
    GrafikaApp.BackgroundListController = BackgroundListController;
})(GrafikaApp || (GrafikaApp = {}));
//# sourceMappingURL=C:/Users/rtobings/GrafikaProject/grafika.server/Grafika.WebSite/Tempaltes/GrafikaApp/output/background/list.js.map