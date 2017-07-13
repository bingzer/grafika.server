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
    var BackgroundDrawingController = (function (_super) {
        __extends(BackgroundDrawingController, _super);
        function BackgroundDrawingController(appCommon, authService, uxService, backgroundService, resourceService, $rootScope) {
            var _this = _super.call(this, appCommon, authService, backgroundService, resourceService, false) || this;
            _this.uxService = uxService;
            _this.backgroundService = backgroundService;
            _this.resourceService = resourceService;
            _this.grafika = new Grafika();
            _this.totalFrame = 0;
            _this.grafikaReady = false;
            _this.graphics = ['freeform', 'line', 'rectangle', 'square', 'circle', 'oval', 'triangle', 'text'];
            _this.grafika.setCallback(_this);
            window['grafika'] = _this.grafika;
            return _this;
        }
        BackgroundDrawingController.prototype.on = function (eventName, obj) {
            // do nothing
        };
        BackgroundDrawingController.prototype.onLoaded = function (background) {
            var _this = this;
            this.uxService.pageTitle = 'Edit ' + this.background.name;
            this.canvas = this.appCommon.elem('#canvas').contextmenu(this.captureContextMenu);
            this.appCommon.elem('#canvas-container').css('max-width', this.background.width).css('max-height', this.background.height);
            return this.backgroundService.getFrames(this.background).then(function (res) {
                _this.grafika.initialize('#canvas', { drawingMode: 'paint', useNavigationText: false }, _this.background);
                _this.grafika.setFrames(res.data);
                _this.grafikaReady = true;
                return _this.appCommon.$q.when(_this.background);
            }).catch(function (err) {
                // most likely this is a new background
                _this.grafika.initialize('#canvas', { drawingMode: 'paint', useNavigationText: false }, _this.background);
                _this.grafika.setFrames(_this.createFirstFrame());
                _this.grafikaReady = true;
                return _this.appCommon.$q.when(_this.background);
            }).finally(function () {
                _this.appCommon.hideLoadingModal();
            });
        };
        BackgroundDrawingController.prototype.showProperties = function (ev) {
            var _this = this;
            return this.appCommon.showDialog('/app/background/edit.html', 'BackgroundEditController', ev).then(function () { return _this.load(); });
        };
        BackgroundDrawingController.prototype.showFrameProperties = function (ev) {
            var controller = new FrameController(this.appCommon, this.grafika);
            return this.appCommon.showDialog('/app/background/drawing-frame.html', function () { return controller; }, ev);
        };
        BackgroundDrawingController.prototype.showGraphicsProperties = function (ev) {
            var _this = this;
            var controller = new GraphicController(this.appCommon, this.grafika);
            return this.appCommon.showDialog('/app/background/drawing-graphics.html', function () { return controller; }, ev)
                .then(function () { return _this.grafika.refreshFrame(); });
        };
        BackgroundDrawingController.prototype.save = function (exit) {
            var _this = this;
            this.grafika.save();
            var background = this.grafika.getAnimation();
            background.type = "background";
            this.backgroundService.update(background)
                .then(function (res) { return _this.backgroundService.updateFrames(background, _this.grafika.getFrames()); })
                .then(function (res) { return _this.resourceService.saveThumbnail(background); })
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
        BackgroundDrawingController.prototype.confirmClearFrame = function () {
            var _this = this;
            this.appCommon.confirm("Clear all graphics in this frame?").then(function () { return _this.grafika.clearFrame(); });
        };
        BackgroundDrawingController.prototype.confirmDeleteGraphics = function () {
            var _this = this;
            this.appCommon.confirm("Delete this graphic?").then(function () { return _this.grafika.deleteSelectedGraphics(); });
        };
        BackgroundDrawingController.prototype.confirmDeleteFrame = function () {
            var _this = this;
            this.appCommon.confirm("Delete this frame?").then(function () { return _this.grafika.exts.deleteFrame(); });
        };
        BackgroundDrawingController.prototype.confirmExit = function () {
            var _this = this;
            if (this.grafika.isModified())
                this.appCommon.confirm('Close?').then(function () { return _this.exit(); });
            else
                this.exit();
        };
        BackgroundDrawingController.prototype.setOptions = function (opts) {
            this.grafika.setOptions(opts);
            this.update();
        };
        BackgroundDrawingController.prototype.exit = function () {
            this.appCommon.$state.go('my-animations');
        };
        BackgroundDrawingController.prototype.update = function () {
            var wrapper = $("#canvas-wrapper");
            wrapper.removeClass("none").removeClass("paint").removeClass("select").removeClass("move").removeClass("delete")
                .addClass(this.grafika.getOptions().drawingMode);
            if (this.grafika.getSelectedGraphics().length > 0)
                wrapper.addClass("move");
            else
                wrapper.removeClass("move");
        };
        ////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
        BackgroundDrawingController.prototype.addResource = function (imageData) {
            var _this = this;
            var resource = {
                id: Grafika.randomUid("res-"),
                type: "background-image",
                mime: imageData.mime
            };
            var currentFrameNumber = this.grafika.getFrame().index;
            return this.resourceService.saveResource(this.background, resource)
                .then(function (res) { return _this.resourceService.upload(res.data, { mime: res.data.mime, blob: imageData.blob() }); })
                .then(function (res) {
                resource.url = _this.resourceService.getResourceUrl(_this.background, resource);
                _this.grafika.addResource(resource);
            })
                .then(function () { return _this.backgroundService.update(_this.background); })
                .then(function () {
                _this.grafika.navigateToFrame(currentFrameNumber);
                _this.grafika.setFrameBackground(resource.id);
                _this.background = _this.grafika.getAnimation();
            });
        };
        ////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
        BackgroundDrawingController.prototype.copyGraphics = function () {
            this.grafika.copySelectedGraphics();
            this.appCommon.toast("Graphics copied");
        };
        BackgroundDrawingController.prototype.cutGraphics = function () {
            this.grafika.copySelectedGraphics();
            this.grafika.deleteSelectedGraphics();
            this.appCommon.toast("Graphics cut");
        };
        BackgroundDrawingController.prototype.pasteGraphics = function () {
            this.grafika.pasteSelectedGraphics();
            this.appCommon.toast("Graphics pasted");
        };
        ////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
        BackgroundDrawingController.prototype.captureContextMenu = function (event) {
            if (!this.canvas)
                return;
            this.canvas.attr('context-menu-x', event.offsetX).attr('context-menu-y', event.offsetY);
        };
        BackgroundDrawingController.prototype.createFirstFrame = function () {
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
        BackgroundDrawingController.$inject = ['appCommon', 'authService', 'uxService', 'backgroundService', 'resourceService', '$rootScope'];
        return BackgroundDrawingController;
    }(GrafikaApp.BaseBackgroundController));
    GrafikaApp.BackgroundDrawingController = BackgroundDrawingController;
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
//# sourceMappingURL=C:/Users/rtobings/GrafikaProject/grafika.server/Grafika.WebSite/Tempaltes/GrafikaApp/output/background/drawing.js.map