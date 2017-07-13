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
            var _this = _super.call(this, appCommon) || this;
            _this.authService = authService;
            _this.animationService = animationService;
            _this.width = 800;
            _this.height = 450;
            _this.orientations = ['Landscape', 'Portrait'];
            _this.orientation = 'Landscape';
            _this.isPublic = _this.authService.getUser().prefs.drawingIsPublic;
            _this.width = _this.appCommon.appConfig.defaultAnimationWidth;
            _this.height = _this.appCommon.appConfig.defaultAnimationHeight;
            return _this;
        }
        AnimationCreateController.prototype.create = function () {
            var _this = this;
            var anim = {
                name: this.name,
                isPublic: this.isPublic
            };
            if (this.orientation === 'Landscape') {
                anim.width = this.width;
                anim.height = this.height;
            }
            else {
                anim.width = this.height;
                anim.height = this.width;
            }
            this.animationService.create(anim).then(function (res) {
                _this.close();
                _this.appCommon.showLoadingModal().then(function () {
                    var anim = res.data;
                    _this.appCommon.$state.go('drawing', { _id: anim._id });
                });
            });
        };
        return AnimationCreateController;
    }(GrafikaApp.DialogController));
    AnimationCreateController.$inject = ['appCommon', 'authService', 'animationService'];
    GrafikaApp.AnimationCreateController = AnimationCreateController;
})(GrafikaApp || (GrafikaApp = {}));
//# sourceMappingURL=C:/Users/rtobings/GrafikaProject/grafika.server/Grafika.WebSite/Tempaltes/GrafikaApp/output/animation/create.js.map