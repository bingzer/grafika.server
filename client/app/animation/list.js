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
            this.list();
        }
        AnimationListController.prototype.list = function () {
            var _this = this;
            this.animationService.list().then(function (res) {
                _this.animations = res.data;
            });
        };
        AnimationListController.prototype.delete = function () {
            if (this.selectedAnimationId) {
                alert(this.selectedAnimationId);
            }
        };
        AnimationListController.$inject = ['appCommon', 'animationService', 'authService'];
        return AnimationListController;
    }(GrafikaApp.BaseController));
    GrafikaApp.AnimationListController = AnimationListController;
})(GrafikaApp || (GrafikaApp = {}));
//# sourceMappingURL=list.js.map