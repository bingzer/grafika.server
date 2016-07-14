var __extends = (this && this.__extends) || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
};
var GrafikaApp;
(function (GrafikaApp) {
    var DialogController = (function () {
        function DialogController($mdDialog) {
            this.$mdDialog = $mdDialog;
        }
        DialogController.prototype.close = function () {
            this.cancel();
        };
        DialogController.prototype.cancel = function () {
            this.$mdDialog.cancel();
        };
        DialogController.$inject = [
            '$mdDialog'
        ];
        return DialogController;
    }());
    GrafikaApp.DialogController = DialogController;
    var AnimationCreateController = (function (_super) {
        __extends(AnimationCreateController, _super);
        function AnimationCreateController($mdDialog, $state, animationService, frameService) {
            _super.call(this, $mdDialog);
            this.$mdDialog = $mdDialog;
            this.$state = $state;
            this.animationService = animationService;
            this.frameService = frameService;
        }
        AnimationCreateController.prototype.create = function () {
            var anim = new GrafikaApp.Animation();
            anim.name = this.name;
            anim.width = this.width;
            anim.height = this.height;
            anim.isPublic = this.isPublic;
            this.animationService.create(anim).then(function (res) {
                var anim = res.data;
                this.$state.go('editor', { _id: anim._id });
                this.cancel();
            });
        };
        AnimationCreateController.$inject = [
            '$mdDialog',
            '$state',
            'animationService',
            'frameService'
        ];
        return AnimationCreateController;
    }(DialogController));
    GrafikaApp.AnimationCreateController = AnimationCreateController;
})(GrafikaApp || (GrafikaApp = {}));
//# sourceMappingURL=create.js.map