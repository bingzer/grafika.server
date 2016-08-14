var __extends = (this && this.__extends) || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
};
var GrafikaApp;
(function (GrafikaApp) {
    var AnimationCreateController = (function (_super) {
        __extends(AnimationCreateController, _super);
        function AnimationCreateController(appCommon, authService, animationService) {
            _super.call(this, appCommon);
            this.authService = authService;
            this.animationService = animationService;
            this.width = 800;
            this.height = 400;
            this.isPublic = this.authService.getUser().prefs.drawingIsPublic;
        }
        AnimationCreateController.prototype.create = function () {
            var _this = this;
            var anim = new GrafikaApp.Animation();
            anim.name = this.name;
            anim.width = this.width;
            anim.height = this.height;
            anim.isPublic = this.isPublic;
            this.animationService.create(anim).then(function (res) {
                _this.close();
                _this.appCommon.showLoadingModal().then(function () {
                    var anim = res.data;
                    _this.appCommon.$state.go('drawing', { _id: anim._id });
                });
            });
        };
        AnimationCreateController.$inject = ['appCommon', 'authService', 'animationService'];
        return AnimationCreateController;
    }(GrafikaApp.DialogController));
    GrafikaApp.AnimationCreateController = AnimationCreateController;
})(GrafikaApp || (GrafikaApp = {}));
//# sourceMappingURL=create.js.map