var __extends = (this && this.__extends) || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
};
var GrafikaApp;
(function (GrafikaApp) {
    var AnimationDetailController = (function (_super) {
        __extends(AnimationDetailController, _super);
        function AnimationDetailController(appCommon, authService, uxService, animationService, frameService, resourceService) {
            _super.call(this, appCommon, authService, animationService, frameService, resourceService);
            this.uxService = uxService;
            this.canEdit = false;
        }
        AnimationDetailController.prototype.onLoaded = function (animation) {
            this.uxService.pageTitle = this.animation.name;
            if (this.authService.isAuthorized('user'))
                this.canEdit = this.authService.getUser()._id === this.animation.userId;
        };
        AnimationDetailController.prototype.edit = function () {
            this.appCommon.$state.go("drawing", { _id: this.animation._id });
        };
        AnimationDetailController.prototype.editData = function (ev) {
            var _this = this;
            this.appCommon.showDialog('AnimationEditController', '/app/animation/edit.html', ev).then(function () { return _this.load(); });
        };
        AnimationDetailController.prototype.delete = function () {
            var _this = this;
            return this.appCommon.confirm('Delete?').then(function () {
                return _this.animationService.delete(_this.animation._id).then(function () {
                    _this.appCommon.navigateHome();
                    return _this.appCommon.toast('Deleted');
                });
            });
        };
        AnimationDetailController.$inject = ['appCommon', 'authService', 'uxService', 'animationService', 'frameService', 'resourceService'];
        return AnimationDetailController;
    }(GrafikaApp.BaseAnimationController));
    GrafikaApp.AnimationDetailController = AnimationDetailController;
})(GrafikaApp || (GrafikaApp = {}));
//# sourceMappingURL=detail.js.map