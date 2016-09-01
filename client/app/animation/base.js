var __extends = (this && this.__extends) || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
};
var GrafikaApp;
(function (GrafikaApp) {
    var BaseAnimationController = (function (_super) {
        __extends(BaseAnimationController, _super);
        function BaseAnimationController(appCommon, authService, animationService, frameService, resourceService, autoLoad) {
            if (autoLoad === void 0) { autoLoad = true; }
            _super.call(this, appCommon, authService);
            this.animationService = animationService;
            this.frameService = frameService;
            this.resourceService = resourceService;
            this.busy = false;
            if (autoLoad)
                this.load();
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
//# sourceMappingURL=base.js.map