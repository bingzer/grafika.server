var __extends = (this && this.__extends) || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
};
var GrafikaApp;
(function (GrafikaApp) {
    var AnimationDrawingController = (function (_super) {
        __extends(AnimationDrawingController, _super);
        function AnimationDrawingController(appCommon, authService, uxService, animationService, frameService, resourceService, $rootScope) {
            _super.call(this, appCommon, authService, animationService, frameService, resourceService, false);
            this.uxService = uxService;
            this.animationService = animationService;
            this.frameService = frameService;
            this.resourceService = resourceService;
            this.grafika = new Grafika();
            this.currentFrame = 1;
            this.totalFrame = 0;
            this.graphics = ['freeform', 'line', 'rectangle', 'square', 'circle', 'oval', 'triangle', 'text'];
            this.appCommon.hideLoadingModal();
            this.grafika.setCallback(this);
            window['grafika'] = this.grafika;
        }
        AnimationDrawingController.prototype.on = function (eventName, obj) {
            switch (eventName) {
                case "frameChanged":
                    this.currentFrame = obj + 1;
                case "frameCount":
                    this.totalFrame = this.grafika.getAnimation().frames.length;
                    break;
            }
        };
        AnimationDrawingController.prototype.onLoaded = function (animation) {
            var _this = this;
            this.uxService.pageTitle = 'Edit ' + this.animation.name;
            this.canvas = this.appCommon.elem('#canvas').contextmenu(this.captureContextMenu);
            this.appCommon.elem('#canvas-container').css('width', this.animation.width).css('height', this.animation.height);
            return this.frameService.get(this.animation).then(function (res) {
                _this.animation.frames = res.data;
                _this.grafika.initialize('#canvas', { drawingMode: 'paint', useNavigationText: false }, _this.animation);
                return _this.appCommon.$q.when(_this.animation);
            });
        };
        AnimationDrawingController.prototype.showProperties = function (ev) {
            var _this = this;
            return this.appCommon.showDialog('/app/animation/edit.html', 'AnimationEditController', ev).then(function () { return _this.load(); });
        };
        AnimationDrawingController.prototype.showFrameProperties = function (ev) {
            var controller = new FrameController(this.appCommon, this.grafika);
            return this.appCommon.showDialog('/app/animation/drawing-frame.html', function () { return controller; }, ev);
        };
        AnimationDrawingController.prototype.showGraphicsProperties = function (ev) {
            var _this = this;
            var controller = new GraphicController(this.appCommon, this.grafika);
            return this.appCommon.showDialog('/app/animation/drawing-graphics.html', function () { return controller; }, ev).then(function () { return _this.grafika.refresh(); });
        };
        AnimationDrawingController.prototype.save = function (exit) {
            var _this = this;
            this.grafika.save();
            var animation = this.grafika.getAnimation();
            this.animationService.update(animation)
                .then(function (res) { return _this.frameService.update(animation, _this.grafika.getFrames()); })
                .then(function (res) { return _this.resourceService.saveThumbnail(animation); })
                .then(function (res) { return _this.resourceService.upload(res.data, _this.grafika.exts.getCanvasBlob()); })
                .then(function (res) {
                if (exit)
                    _this.exit();
                _this.appCommon.toast('Successfully saved!');
            });
        };
        AnimationDrawingController.prototype.confirmClearFrame = function () {
            var _this = this;
            this.appCommon.confirm("Clear all graphics in this frame?").then(function () { return _this.grafika.clear(); });
        };
        AnimationDrawingController.prototype.confirmExit = function () {
            var _this = this;
            if (this.grafika.isModified())
                this.appCommon.confirm('Close?').then(function () { return _this.exit(); });
            else
                this.exit();
        };
        AnimationDrawingController.prototype.exit = function () {
            this.appCommon.$state.go('my-animations');
        };
        AnimationDrawingController.prototype.update = function () {
            this.canvas.removeClass("none paint select move delete");
            this.canvas.addClass(this.grafika.getOptions().drawingMode);
        };
        AnimationDrawingController.prototype.captureContextMenu = function (event) {
            if (!this.canvas)
                return;
            this.canvas.attr('context-menu-x', event.offsetX).attr('context-menu-y', event.offsetY);
        };
        AnimationDrawingController.$inject = ['appCommon', 'authService', 'uxService', 'animationService', 'frameService', 'resourceService', '$rootScope'];
        return AnimationDrawingController;
    }(GrafikaApp.BaseAnimationController));
    GrafikaApp.AnimationDrawingController = AnimationDrawingController;
    var FrameController = (function (_super) {
        __extends(FrameController, _super);
        function FrameController(appCommon, grafika) {
            _super.call(this, appCommon);
            this.grafika = grafika;
            this.frame = this.grafika.getFrame();
        }
        FrameController.prototype.close = function (response) {
            this.grafika.refresh();
            return _super.prototype.close.call(this);
        };
        return FrameController;
    }(GrafikaApp.DialogController));
    var GraphicController = (function (_super) {
        __extends(GraphicController, _super);
        function GraphicController(appCommon, grafika) {
            _super.call(this, appCommon, grafika);
            this.graphics = this.frame.layers[0].graphics;
        }
        GraphicController.prototype.stringify = function (obj) {
            return JSON.stringify(obj);
        };
        return GraphicController;
    }(FrameController));
})(GrafikaApp || (GrafikaApp = {}));
//# sourceMappingURL=drawing.js.map