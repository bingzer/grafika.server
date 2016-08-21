var __extends = (this && this.__extends) || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
};
var GrafikaApp;
(function (GrafikaApp) {
    var AnimationDrawingController = (function (_super) {
        __extends(AnimationDrawingController, _super);
        function AnimationDrawingController(appCommon, authService, uxService, animationService, frameService, resourceService) {
            _super.call(this, appCommon, authService, animationService, frameService, resourceService);
            this.uxService = uxService;
            this.animationService = animationService;
            this.frameService = frameService;
            this.resourceService = resourceService;
            this.grafika = new Grafika();
            this.appCommon.hideLoadingModal();
        }
        AnimationDrawingController.prototype.onLoaded = function (animation) {
            var _this = this;
            this.uxService.pageTitle = 'Edit ' + this.animation.name;
            this.appCommon.elem('#canvas-container').css('width', this.animation.width).css('height', this.animation.height);
            this.frameService.get(this.animation).then(function (res) {
                _this.animation.frames = res.data;
                _this.grafika.initialize('#canvas', { drawingMode: 'paint' }, _this.animation);
            });
        };
        AnimationDrawingController.prototype.showProperties = function (ev) {
            var _this = this;
            return this.appCommon.showDialog('AnimationEditController', '/app/animation/edit.html', ev).then(function () { return _this.load(); });
        };
        AnimationDrawingController.prototype.save = function (exit) {
            var _this = this;
            this.grafika.save();
            var animation = this.grafika.getAnimation();
            this.animationService.update(animation).then(function (res) {
                return _this.resourceService.saveThumbnail(animation);
            }).then(function (res) {
                return _this.resourceService.upload(res.data, _this.grafika.exts.getCanvasBlob());
            }).then(function (res) {
                if (exit)
                    _this.exit();
                _this.appCommon.toast('Successfully saved!');
            });
        };
        AnimationDrawingController.prototype.confirmExit = function () {
            var _this = this;
            var anim = this.animation;
            if (anim.modified)
                this.appCommon.confirm('Close?').then(function () { return _this.exit(); });
            else
                this.exit();
        };
        AnimationDrawingController.prototype.exit = function () {
            this.appCommon.$state.go('my-animations');
        };
        AnimationDrawingController.$inject = ['appCommon', 'authService', 'uxService', 'animationService', 'frameService', 'resourceService'];
        return AnimationDrawingController;
    }(GrafikaApp.BaseAnimationController));
    GrafikaApp.AnimationDrawingController = AnimationDrawingController;
})(GrafikaApp || (GrafikaApp = {}));
//# sourceMappingURL=drawing.js.map