var __extends = (this && this.__extends) || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
};
var GrafikaApp;
(function (GrafikaApp) {
    var BaseBackgroundController = (function (_super) {
        __extends(BaseBackgroundController, _super);
        function BaseBackgroundController(appCommon, authService, backgroundService, resourceService, autoLoad) {
            if (autoLoad === void 0) { autoLoad = true; }
            var _this = _super.call(this, appCommon, authService) || this;
            _this.backgroundService = backgroundService;
            _this.resourceService = resourceService;
            _this.busy = false;
            if (autoLoad)
                _this.load();
            return _this;
        }
        BaseBackgroundController.prototype.load = function () {
            var _this = this;
            this.busy = true;
            this.backgroundService.get(this.appCommon.$stateParams['_id'])
                .then(function (res) {
                _this.background = res.data;
                return _this.onLoaded(_this.background);
            })
                .catch(function (err) { return _this.onError(err); })
                .finally(function () { return _this.busy = false; });
        };
        BaseBackgroundController.prototype.onError = function (error) {
            this.appCommon.$log.error(this.appCommon.formatErrorMessage(error));
        };
        return BaseBackgroundController;
    }(GrafikaApp.AuthController));
    BaseBackgroundController.$inject = ['appCommon', 'authService', 'backgroundService', 'resourceService'];
    GrafikaApp.BaseBackgroundController = BaseBackgroundController;
})(GrafikaApp || (GrafikaApp = {}));
//# sourceMappingURL=C:/Users/rtobings/GrafikaProject/grafika.server/Grafika.WebSite/Tempaltes/GrafikaApp/output/background/base.js.map