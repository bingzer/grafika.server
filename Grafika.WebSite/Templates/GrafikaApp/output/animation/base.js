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
    var BaseAnimationController = (function (_super) {
        __extends(BaseAnimationController, _super);
        function BaseAnimationController(appCommon, authService, animationService, frameService, resourceService, autoLoad) {
            if (autoLoad === void 0) { autoLoad = true; }
            var _this = _super.call(this, appCommon, authService) || this;
            _this.animationService = animationService;
            _this.frameService = frameService;
            _this.resourceService = resourceService;
            _this.busy = false;
            if (autoLoad)
                _this.load();
            return _this;
        }
        BaseAnimationController.prototype.load = function () {
            var _this = this;
            this.busy = true;
            this.animationService.get(this.appCommon.$stateParams['_id'])
                .then(function (res) {
                _this.animation = res.data;
                return _this.onLoaded(_this.animation);
            })
                .catch(function (err) { return _this.onError(err); })
                .finally(function () { return _this.busy = false; });
        };
        BaseAnimationController.prototype.onError = function (error) {
            this.appCommon.$log.error(this.appCommon.formatErrorMessage(error));
        };
        BaseAnimationController.$inject = ['appCommon', 'authService', 'animationService', 'frameService', 'resourceService'];
        return BaseAnimationController;
    }(GrafikaApp.AuthController));
    GrafikaApp.BaseAnimationController = BaseAnimationController;
})(GrafikaApp || (GrafikaApp = {}));
//# sourceMappingURL=C:/Users/rtobings/GrafikaProject/grafika.server/Grafika.WebSite/Tempaltes/GrafikaApp/output/animation/base.js.map