var __extends = (this && this.__extends) || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
};
var GrafikaApp;
(function (GrafikaApp) {
    var AnimationCreateController = (function (_super) {
        __extends(AnimationCreateController, _super);
        function AnimationCreateController(appCommon, animationService) {
            _super.call(this, appCommon);
            this.animationService = animationService;
            this.width = 800;
            this.height = 400;
        }
        AnimationCreateController.prototype.create = function () {
            var _this = this;
            var anim = new GrafikaApp.Animation();
            anim.name = this.name;
            anim.width = this.width;
            anim.height = this.height;
            anim.isPublic = this.isPublic;
            this.animationService.create(anim).then(function (res) {
                var anim = res.data;
                _this.appCommon.$state.go('drawing', { _id: anim._id });
                _this.close();
            });
        };
        AnimationCreateController.$inject = ['appCommon', 'animationService'];
        return AnimationCreateController;
    }(GrafikaApp.DialogController));
    GrafikaApp.AnimationCreateController = AnimationCreateController;
})(GrafikaApp || (GrafikaApp = {}));
//# sourceMappingURL=create.js.map