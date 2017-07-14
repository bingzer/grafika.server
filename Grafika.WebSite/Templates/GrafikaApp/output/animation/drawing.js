var __extends = (this && this.__extends) || (function () {
    var extendStatics = Object.setPrototypeOf ||
        ({ __proto__: [] } instanceof Array && function (d, b) { d.__proto__ = b; }) ||
        function (d, b) { for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p]; };
    return function (d, b) {
        extendStatics(d, b);
        function __() { this.constructor = d; }
        d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
    };
})();
var GrafikaApp;
(function (GrafikaApp) {
    var AnimationDrawingController = (function (_super) {
        __extends(AnimationDrawingController, _super);
        function AnimationDrawingController(appCommon, authService, uxService, animationService, frameService, resourceService, $rootScope) {
            var _this = _super.call(this, appCommon, authService, animationService, frameService, resourceService, false) || this;
            _this.uxService = uxService;
            _this.animationService = animationService;
            _this.frameService = frameService;
            _this.resourceService = resourceService;
            _this.grafika = new Grafika();
            _this.currentFrame = 1;
            _this.totalFrame = 0;
            _this.grafikaReady = false;
            _this.graphics = ['freeform', 'line', 'rectangle', 'square', 'circle', 'oval', 'triangle', 'text'];
            _this.grafika.setCallback(_this);
            window['grafika'] = _this.grafika;
            return _this;
        }
        AnimationDrawingController.prototype.on = function (eventName, obj) {
            switch (eventName) {
                case Grafika.EVT_FRAME_CHANGED:
                    this.currentFrame = obj + 1;
                    $('#currentFrame').val(this.currentFrame);
                    break;
                case Grafika.EVT_FRAME_COUNT:
                    this.totalFrame = obj;
                    break;
                case Grafika.EVT_GRAPHIC_SELECTED:
                    this.update();
                    break;
            }
        };
        AnimationDrawingController.prototype.onLoaded = function (animation) {
            var _this = this;
            this.uxService.pageTitle = 'Edit ' + this.animation.name;
            this.canvas = this.appCommon.elem('#canvas').contextmenu(this.captureContextMenu);
            this.appCommon.elem('#canvas-container').css('max-width', this.animation.width).css('max-height', this.animation.height);
            return this.frameService.get(this.animation).then(function (res) {
                _this.grafika.initialize('#canvas', { drawingMode: 'paint', useNavigationText: false }, _this.animation);
                _this.grafika.setFrames(res.data);
                _this.grafikaReady = true;
                return _this.appCommon.$q.when(_this.animation);
            }).catch(function (err) {
                // most likely this is a new animation
                _this.grafika.initialize('#canvas', { drawingMode: 'paint', useNavigationText: false }, _this.animation);
                _this.grafika.setFrames(_this.createFirstFrame());
                _this.grafikaReady = true;
                return _this.appCommon.$q.when(_this.animation);
            }).finally(function () {
                _this.appCommon.hideLoadingModal();
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
            return this.appCommon.showDialog('/app/animation/drawing-graphics.html', function () { return controller; }, ev)
                .then(function () { return _this.grafika.refreshFrame(); });
        };
        AnimationDrawingController.prototype.save = function (exit) {
            var _this = this;
            this.grafika.save();
            var animation = this.grafika.getAnimation();
            this.animationService.update(animation)
                .then(function (res) { return _this.frameService.update(animation, _this.grafika.getFrames()); })
                .then(function (res) { return _this.resourceService.saveThumbnail(animation); })
                .then(function (res) {
                var defer = _this.appCommon.$q.defer();
                _this.grafika.exts.getCanvasBlob(function (err, data) {
                    if (err)
                        return defer.reject();
                    _this.resourceService.upload(res.data, data)
                        .then(function () { return defer.resolve(); }).catch(function (reason) { return defer.reject(reason); });
                });
                return defer.promise;
            })
                .then(function (res) {
                if (exit)
                    _this.exit();
                _this.appCommon.toast('Successfully saved!');
            });
        };
        AnimationDrawingController.prototype.confirmClearFrame = function () {
            var _this = this;
            this.appCommon.confirm("Clear all graphics in this frame?").then(function () { return _this.grafika.clearFrame(); });
        };
        AnimationDrawingController.prototype.confirmDeleteGraphics = function () {
            var _this = this;
            this.appCommon.confirm("Delete this graphic?").then(function () { return _this.grafika.deleteSelectedGraphics(); });
        };
        AnimationDrawingController.prototype.confirmDeleteFrame = function () {
            var _this = this;
            this.appCommon.confirm("Delete this frame?").then(function () { return _this.grafika.exts.deleteFrame(); });
        };
        AnimationDrawingController.prototype.confirmExit = function () {
            var _this = this;
            if (this.grafika.isModified())
                this.appCommon.confirm('Close?').then(function () { return _this.exit(); });
            else
                this.exit();
        };
        AnimationDrawingController.prototype.setOptions = function (opts) {
            this.grafika.setOptions(opts);
            this.update();
        };
        AnimationDrawingController.prototype.exit = function () {
            this.appCommon.$state.go('my-animations');
        };
        AnimationDrawingController.prototype.update = function () {
            var wrapper = $("#canvas-wrapper");
            wrapper.removeClass("none").removeClass("paint").removeClass("select").removeClass("move").removeClass("delete")
                .addClass(this.grafika.getOptions().drawingMode);
            if (this.grafika.getSelectedGraphics().length > 0)
                wrapper.addClass("move");
            else
                wrapper.removeClass("move");
        };
        ////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
        AnimationDrawingController.prototype.addResource = function (imageData) {
            var _this = this;
            var resource = {
                id: Grafika.randomUid("res-"),
                type: "background-image",
                mime: imageData.mime
            };
            var currentFrameNumber = this.grafika.getFrame().index;
            return this.resourceService.saveResource(this.animation, resource)
                .then(function (res) { return _this.resourceService.upload(res.data, { mime: res.data.mime, blob: imageData.blob() }); })
                .then(function (res) {
                resource.url = _this.resourceService.getResourceUrl(_this.animation, resource);
                _this.grafika.addResource(resource);
            })
                .then(function () { return _this.animationService.update(_this.animation); })
                .then(function () {
                _this.grafika.navigateToFrame(currentFrameNumber);
                _this.grafika.setFrameBackground(resource.id);
                _this.animation = _this.grafika.getAnimation();
            });
        };
        AnimationDrawingController.prototype.existingResources = function (evt) {
            var _this = this;
            return this.appCommon.showDialog("/app/animation/resources/list.html", "ResourceListController", evt, { resources: this.animation.resources, grafika: this.grafika }, "vm", true)
                .then(function (resource) {
                if (resource)
                    _this.grafika.setFrameBackground(resource.id);
            });
        };
        ////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
        AnimationDrawingController.prototype.copyGraphics = function () {
            this.grafika.copySelectedGraphics();
            this.appCommon.toast("Graphics copied");
        };
        AnimationDrawingController.prototype.cutGraphics = function () {
            this.grafika.copySelectedGraphics();
            this.grafika.deleteSelectedGraphics();
            this.appCommon.toast("Graphics cut");
        };
        AnimationDrawingController.prototype.pasteGraphics = function () {
            this.grafika.pasteSelectedGraphics();
            this.appCommon.toast("Graphics pasted");
        };
        ////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
        AnimationDrawingController.prototype.captureContextMenu = function (event) {
            if (!this.canvas)
                return;
            this.canvas.attr('context-menu-x', event.offsetX).attr('context-menu-y', event.offsetY);
        };
        AnimationDrawingController.prototype.createFirstFrame = function () {
            return [{
                    id: Grafika.randomUid(),
                    index: 0,
                    backgroundColor: "#ffffff",
                    foregroundColor: "#000000",
                    backgroundResourceId: undefined,
                    type: "frames",
                    modified: false,
                    layers: [
                        {
                            id: Grafika.randomUid(),
                            index: 0,
                            graphics: [],
                            type: "layer"
                        }
                    ]
                }];
        };
        return AnimationDrawingController;
    }(GrafikaApp.BaseAnimationController));
    AnimationDrawingController.$inject = ['appCommon', 'authService', 'uxService', 'animationService', 'frameService', 'resourceService', '$rootScope'];
    GrafikaApp.AnimationDrawingController = AnimationDrawingController;
    ////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
    var FrameController = (function (_super) {
        __extends(FrameController, _super);
        function FrameController(appCommon, grafika) {
            var _this = _super.call(this, appCommon) || this;
            _this.grafika = grafika;
            _this.frame = _this.grafika.getFrame();
            return _this;
        }
        FrameController.prototype.close = function (response) {
            this.grafika.refresh();
            return _super.prototype.close.call(this);
        };
        return FrameController;
    }(GrafikaApp.DialogController));
    ////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
    var GraphicController = (function (_super) {
        __extends(GraphicController, _super);
        function GraphicController(appCommon, grafika) {
            var _this = _super.call(this, appCommon, grafika) || this;
            _this.graphics = _this.frame.layers[0].graphics;
            return _this;
        }
        GraphicController.prototype.stringify = function (obj) {
            return JSON.stringify(obj);
        };
        return GraphicController;
    }(FrameController));
})(GrafikaApp || (GrafikaApp = {}));
//# sourceMappingURL=C:/Users/ricky/GrafikaProject/grafika.server/Grafika.WebSite/Tempaltes/GrafikaApp/output/animation/drawing.js.map