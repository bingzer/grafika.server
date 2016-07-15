var __extends = (this && this.__extends) || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
};
var GrafikaApp;
(function (GrafikaApp) {
    var AnimationCreateController = (function (_super) {
        __extends(AnimationCreateController, _super);
        function AnimationCreateController($mdDialog, $state, animationService, frameService) {
            _super.call(this, $mdDialog);
            this.$mdDialog = $mdDialog;
            this.$state = $state;
            this.animationService = animationService;
            this.frameService = frameService;
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
                _this.$state.go('editor', { _id: anim._id });
                _this.close();
            });
        };
        AnimationCreateController.$inject = [
            '$mdDialog',
            '$state',
            'animationService',
            'frameService'
        ];
        return AnimationCreateController;
    }(GrafikaApp.DialogController));
    GrafikaApp.AnimationCreateController = AnimationCreateController;
})(GrafikaApp || (GrafikaApp = {}));
//# sourceMappingURL=create.js.map