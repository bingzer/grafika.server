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
            var paging = new GrafikaApp.Paging({ isPublic: true, query: this.query });
            this.animationService.list(paging).then(function (res) {
                _this.animations = res.data;
            });
        };
        AnimationListController.prototype.canPlay = function () {
            return true;
        };
        AnimationListController.prototype.canDelete = function () {
            return false;
        };
        AnimationListController.prototype.filter = function () {
        };
        AnimationListController.$inject = ['appCommon', 'animationService', 'authService'];
        return AnimationListController;
    }(GrafikaApp.BaseController));
    GrafikaApp.AnimationListController = AnimationListController;
})(GrafikaApp || (GrafikaApp = {}));
//# sourceMappingURL=list.js.map