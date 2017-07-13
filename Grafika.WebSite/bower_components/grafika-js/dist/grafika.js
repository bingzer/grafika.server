var __extends = (this && this.__extends) || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
};
var Grafika = (function () {
    function Grafika() {
        var _this = this;
        this.version = Grafika.VERSION;
        this.animation = {};
        this.frames = [];
        this.selectedGraphics = [];
        this.copiedSelectedGraphics = [];
        this.renderers = [];
        this.callback = new Grafika.DefaultCallback(this);
        this.isPainting = false;
        this.isMovingGraphics = false;
        this.animator = undefined;
        this.options = new Grafika.DefaultOption();
        this.plugins = [];
        this.scale = { x: 1, y: 1 };
        this.commando = new Grafika.CommandManager(this);
        this.initialize = function (canvasId, opts, anim) {
            Grafika.log(_this, "-------- v" + _this.version + " --------");
            _this.validateCanvas(canvasId);
            _this.registerRenderer(new Grafika.BackgroundLayerRenderer(_this));
            _this.registerRenderer(new Grafika.BackgroundColorRenderer(_this));
            _this.registerRenderer(new Grafika.BackgroundImageRenderer(_this));
            _this.registerRenderer(new Grafika.RectangleRenderer(_this));
            _this.registerRenderer(new Grafika.SquareRenderer(_this));
            _this.registerRenderer(new Grafika.CircleRenderer(_this));
            _this.registerRenderer(new Grafika.OvalRenderer(_this));
            _this.registerRenderer(new Grafika.FreeformRenderer(_this));
            _this.registerRenderer(new Grafika.TriangleRenderer(_this));
            _this.registerRenderer(new Grafika.LineRenderer(_this));
            _this.registerRenderer(new Grafika.TextRenderer(_this));
            _this.registerRenderer(_this.layerRenderer = new Grafika.LayerRenderer(_this));
            _this.registerRenderer(_this.frameRenderer = new Grafika.FrameRenderer(_this));
            _this.registerRenderer(_this.animRenderer = new Grafika.AnimationRenderer(_this));
            _this.registerRenderer(_this.defaultRenderer = new Grafika.DefaultRenderer(_this));
            _this.setAnimation(anim);
            _this.setOptions(opts);
            if (Grafika.Plugins) {
                Grafika.Plugins.forEach(function (func) {
                    var plugin = func(_this);
                    Grafika.log(_this, "Plugin: " + plugin.name + " v. " + plugin.version);
                    _this.plugins.push(plugin);
                });
            }
            Grafika.log(_this, "Grafika v." + _this.version + " [initialized]");
            _this.callback.on(Grafika.EVT_INITIALIZED);
        };
        this.destroy = function () {
            _this.selectedGraphics = [];
            if (_this.isPlaying())
                _this.pause();
            _this.setAnimation(_this.animRenderer.create());
            _this.frame = _this.frameRenderer.create();
            _this.frames = [_this.frame];
            _this.commando.clearActions();
            _this.clearFrame();
            _this.callback.on(Grafika.EVT_DESTROYED);
        };
        this.getAnimation = function () { return _this.animation; };
        this.setAnimation = function (anim) {
            _this.animation = _this.animRenderer.create(anim);
            if (!_this.animation.name)
                throw new Error('Animation name is required');
            if (!_this.animation.width || !_this.animation.height)
                throw new Error('Animation width + height is required');
            Grafika.log(_this, 'Animation (' + _this.animation.localId + ')' +
                ' name: ' + _this.animation.name +
                ', timer: ' + _this.animation.timer +
                ', size: ' + _this.animation.width + ' x ' + _this.animation.height);
            _this.scale.x = _this.animation.width / (_this.context.canvas.width || _this.animation.width);
            _this.scale.y = _this.animation.height / (_this.context.canvas.height || _this.animation.height);
            _this.context.scale(_this.scale.x, _this.scale.y);
            _this.contextDrawing.scale(_this.scale.x, _this.scale.y);
            _this.contextBackground.scale(_this.scale.x, _this.scale.y);
            _this.context.canvas.setAttribute('width', "" + _this.animation.width);
            _this.context.canvas.setAttribute('height', "" + _this.animation.height);
            _this.contextBackground.canvas.setAttribute('width', "" + _this.animation.width);
            _this.contextBackground.canvas.setAttribute('height', "" + _this.animation.height);
            _this.contextDrawing.canvas.setAttribute('width', "" + _this.animation.width);
            _this.contextDrawing.canvas.setAttribute('height', "" + _this.animation.height);
            _this.setFrames(_this.frames);
        };
        this.saveAnimation = function (anim) {
            if (anim) {
                _this.animation = _this.animRenderer.create(anim);
            }
            _this.animation.totalFrame = _this.frames.length;
            _this.animation.modified = false;
            _this.animation.dateModified = Date.now();
            _this.animation.client = {
                version: _this.version,
                browser: navigator.userAgent
            };
            _this.callback.on(Grafika.EVT_ANIMATION_SAVED);
        };
        this.play = function () {
            if (_this.animator)
                return;
            if (!_this.animation.timer)
                _this.animation.timer = 500;
            Grafika.log(_this, "Animation started. Timer: " + _this.animation.timer + " ms");
            var start;
            var that = _this;
            function animate(timestamp) {
                if (!start)
                    start = timestamp;
                var delta = timestamp - start;
                if (delta > that.animation.timer) {
                    start = timestamp;
                    if (that.animation.currentFrame >= that.frames.length - 1) {
                        if (that.options.loop) {
                            that.animation.currentFrame = 0;
                            that.navigateTo(that.animation.currentFrame, false);
                        }
                        else
                            return that.pause();
                    }
                    else {
                        that.navigateTo(that.animation.currentFrame + 1, false);
                    }
                }
                that.animator = window.requestAnimationFrame(animate);
            }
            _this.animator = window.requestAnimationFrame(animate);
            _this.callback.on(Grafika.EVT_FRAME_COUNT, _this.frames.length);
            _this.callback.on(Grafika.EVT_PLAYING, true);
            _this.navigateToFrame(0);
        };
        this.pause = function () {
            if (!_this.isPlaying())
                return;
            window.cancelAnimationFrame(_this.animator);
            _this.animator = undefined;
            _this.callback.on(Grafika.EVT_PLAYING, false);
            Grafika.log(_this, 'Animation stopped');
        };
        this.isPlaying = function () { return Grafika.isDefined(_this.animator); };
        this.isModified = function () {
            if (_this.animation.modified)
                return true;
            if (_this.frame.modified)
                return true;
            return false;
        };
        this.save = function () {
            _this.saveAnimation();
            _this.saveFrame();
        };
        this.getScale = function () { return _this.scale; };
        this.addResource = function (resource) {
            for (var i = 0; i < _this.animation.resources.length; i++) {
                if (_this.animation.resources[i].id === resource.id)
                    return;
            }
            var newResource = _this.getResourceRenderer(resource).create(resource);
            _this.animation.resources.push(newResource);
        };
        this.hasResource = function (resId) {
            for (var i = 0; i < _this.animation.resources.length; i++) {
                if (_this.animation.resources[i].id === resId)
                    return true;
            }
            return false;
        };
        this.getResource = function (resId) {
            for (var i = 0; i < _this.animation.resources.length; i++) {
                if (_this.animation.resources[i].id === resId)
                    return _this.animation.resources[i];
            }
            return null;
        };
        this.deleteResource = function (resId) {
            for (var i = 0; i < _this.animation.resources.length; i++) {
                if (_this.animation.resources[i].id === resId) {
                    _this.animation.resources.splice(i, 1);
                    break;
                }
            }
            for (var i = 0; i < _this.frames.length; i++) {
                if (_this.frames[i].backgroundResourceId == resId)
                    delete _this.frames[i].backgroundResourceId;
            }
            _this.refreshFrame({ drawBackground: true });
        };
        this.getResources = function () {
            return _this.animation.resources;
        };
        this.getLayer = function () { return _this.frame.layers[0]; };
        this.refreshFrame = function (refreshOptions) {
            if (refreshOptions === void 0) { refreshOptions = { keepCurrentGraphic: false, keepSelectedGraphics: false, drawBackground: false }; }
            if (Grafika.isUndefined(refreshOptions.keepCurrentGraphic) || !refreshOptions.keepCurrentGraphic)
                _this.currentGraphic = null;
            if (Grafika.isUndefined(refreshOptions.keepSelectedGraphics) || !refreshOptions.keepSelectedGraphics)
                _this.selectedGraphics = [];
            if (refreshOptions.drawBackground)
                _this.frameRenderer.drawBackground(_this.contextBackground, _this.frame);
            Grafika.clearCanvas(_this.context);
            _this.frameRenderer.draw(_this.context, _this.frame);
        };
        this.getFrame = function () { return _this.frame; };
        this.getFrames = function () { return _this.frames; };
        this.clearFrame = function () {
            _this.frame = _this.frameRenderer.create();
            _this.commando.clearActions();
            _this.refreshFrame();
        };
        this.setFrames = function (frames) {
            if (Grafika.isUndefined(frames) || frames.length == 0)
                frames = [_this.frameRenderer.create()];
            _this.frames = frames;
            _this.animation.totalFrame = _this.frames.length;
            _this.frame = _this.frames[0];
            _this.navigateToFrame(0);
            _this.callback.on(Grafika.EVT_FRAME_COUNT, _this.animation.totalFrame);
        };
        this.saveFrame = function () {
            _this.frame.modified = false;
            _this.frames[_this.animation.currentFrame] = _this.frame;
            _this.callback.on(Grafika.EVT_FRAME_SAVED, _this.animation.currentFrame);
        };
        this.setFrameBackground = function (resource) {
            if (Grafika.isUndefined(resource))
                return;
            if (typeof (resource) === "string" || resource.id) {
                var resId = resource.id || resource;
                if (!_this.hasResource(resId) && typeof (resource) !== "string")
                    _this.addResource(resource);
                if (_this.hasResource(resId))
                    _this.frame.backgroundResourceId = resId;
                else
                    throw new Error("'" + resId + "' is not a resource");
            }
            else if (resource.backgroundColor)
                _this.frame.backgroundColor = resource.backgroundColor;
            _this.refreshFrame({ drawBackground: true });
        };
        this.nextFrame = function () { return _this.navigateToFrame(_this.animation.currentFrame + 1); };
        this.previousFrame = function () { return _this.navigateToFrame(_this.animation.currentFrame - 1); };
        this.navigateToFrame = function (index) { return _this.navigateTo(index, true); };
        this.findSelectedGraphics = function (x, y) {
            var g;
            _this.selectedGraphics = [];
            for (var i = 0; i < _this.frame.layers.length; i++) {
                var layer = _this.frame.layers[i];
                for (var j = 0; j < layer.graphics.length; j++) {
                    g = layer.graphics[j];
                    if (_this.getGraphicRenderer(g).contains(g, x, y)) {
                        _this.selectedGraphics.push(g);
                    }
                }
            }
            if (_this.selectedGraphics.length > 1) {
                var closest = _this.selectedGraphics[0];
                var longestSide = Grafika.calculateFurthestDistance(x, y, closest);
                for (var i = 1; i < _this.selectedGraphics.length; i++) {
                    if (Grafika.calculateFurthestDistance(x, y, _this.selectedGraphics[i]) < longestSide)
                        closest = _this.selectedGraphics[i];
                }
                return _this.selectedGraphics = [closest];
            }
            return _this.selectedGraphics;
        };
        this.findGraphic = function (id) {
            var graphicId = id && id.id || id;
            var layer = _this.getLayer();
            for (var i = 0; i < layer.graphics.length; i++) {
                if (layer.graphics[i].id == graphicId)
                    return layer.graphics[i];
            }
            return null;
        };
        this.selectGraphic = function (id) {
            var graphicId = id && id.id || id;
            var graphic = _this.findGraphic(graphicId);
            if (graphic) {
                _this.selectedGraphics = [graphic];
                _this.refreshFrame({ keepSelectedGraphics: true });
            }
            return graphic;
        };
        this.deleteGraphic = function (id, actionable) {
            if (actionable === void 0) { actionable = true; }
            var graphic = _this.selectGraphic(id);
            _this.deleteSelectedGraphics(actionable);
            return graphic;
        };
        this.getSelectedGraphics = function () { return _this.selectedGraphics; };
        this.deleteSelectedGraphics = function (actionable) {
            if (actionable === void 0) { actionable = true; }
            _this.frame.modified = true;
            var temp = [];
            var graphics = _this.getLayer().graphics;
            for (var i = 0; i < graphics.length; i++) {
                var found = false;
                for (var j = 0; j < _this.selectedGraphics.length; j++) {
                    if (graphics[i].id == _this.selectedGraphics[j].id) {
                        found = true;
                        if (found)
                            break;
                    }
                }
                if (!found)
                    temp.push(graphics[i]);
            }
            _this.getLayer().graphics = temp;
            if (actionable && Grafika.isDefined(_this.selectedGraphics[0])) {
                _this.callback.on(Grafika.EVT_GRAPHIC_DELETED);
                _this.commando.addAction(new Grafika.GraphicDeleted(_this, _this.selectedGraphics[0]));
            }
            _this.refreshFrame();
        };
        this.copySelectedGraphics = function () {
            if (!_this.selectedGraphics)
                return;
            _this.copiedSelectedGraphics = Grafika.clone(_this.selectedGraphics);
            for (var i = 0; i < _this.copiedSelectedGraphics.length; i++) {
                _this.copiedSelectedGraphics[i].id = Grafika.randomUid();
            }
            _this.callback.on(Grafika.EVT_GRAPHIC_COPIED);
        };
        this.pasteSelectedGraphics = function () {
            if (!_this.copiedSelectedGraphics)
                return;
            _this.selectedGraphics = Grafika.clone(_this.copiedSelectedGraphics);
            for (var i = 0; i < _this.selectedGraphics.length; i++) {
                _this.selectedGraphics[i].id = Grafika.randomUid();
            }
            _this.setOptions({ drawingMode: Grafika.MODE_SELECT });
            _this.getLayer().graphics = _this.getLayer().graphics.concat(_this.selectedGraphics);
            _this.refreshFrame({ keepSelectedGraphics: true });
            _this.callback.on(Grafika.EVT_GRAPHIC_PASTED);
            _this.commando.addAction(new Grafika.GraphicPasted(_this, _this.selectedGraphics[0]));
        };
        this.getCurrentGraphic = function () { return _this.currentGraphic; };
        this.getOptions = function () { return _this.options; };
        this.getCanvas = function () { return _this.context.canvas; };
        this.getCanvasContext = function () { return _this.context; };
        this.setCallback = function (callback) {
            if (Grafika.isUndefined(callback))
                throw new Error('callback cannot be undefined');
            _this.callback = callback;
        };
        this.setOptions = function (opts) {
            if (!opts)
                return;
            var shouldRefreshFrame = false;
            var drawBackground = false;
            if (opts.backgroundColor) {
                _this.options.backgroundColor = opts.backgroundColor;
                _this.frame.backgroundColor = _this.options.backgroundColor;
                _this.frame.modified = true;
                shouldRefreshFrame = true;
                drawBackground = true;
            }
            if (opts.foregroundColor) {
                _this.options.foregroundColor = opts.foregroundColor;
                _this.frame.foregroundColor = _this.options.foregroundColor;
                shouldRefreshFrame = true;
            }
            if (opts.brushSize)
                _this.options.brushSize = opts.brushSize;
            if (opts.graphic) {
                _this.options.graphic = opts.graphic;
                shouldRefreshFrame = true;
            }
            if (Grafika.isDefined(opts.graphicFill) && opts.graphicFill != null) {
                _this.options.graphicFill = opts.graphicFill;
                shouldRefreshFrame = true;
            }
            if (Grafika.isDefined(opts.useCarbonCopy) && opts.useCarbonCopy != null) {
                _this.options.useCarbonCopy = opts.useCarbonCopy;
                shouldRefreshFrame = true;
            }
            if (Grafika.isDefined(opts.useNavigationText) && opts.useNavigationText != null) {
                _this.options.useNavigationText = opts.useNavigationText;
                shouldRefreshFrame = true;
            }
            if (Grafika.isDefined(opts.navigationTextX) && opts.navigationTextX != null) {
                _this.options.navigationTextX = opts.navigationTextX;
                shouldRefreshFrame = true;
            }
            if (Grafika.isDefined(opts.navigationTextY) && opts.navigationTextY != null) {
                _this.options.navigationTextY = opts.navigationTextY;
                shouldRefreshFrame = true;
            }
            if (Grafika.isDefined(opts.loop) && opts.loop != null) {
                _this.options.loop = opts.loop;
            }
            if (opts.drawingMode) {
                var mode = opts.drawingMode.toLowerCase();
                if (mode != Grafika.MODE_NONE && mode != Grafika.MODE_PAINT && mode != Grafika.MODE_SELECT)
                    throw new Error('Drawing mode is not supported: ' + mode);
                _this.options.drawingMode = mode;
                if (_this.options.drawingMode == Grafika.MODE_PAINT || _this.options.drawingMode == Grafika.MODE_NONE)
                    shouldRefreshFrame = true;
            }
            if (Grafika.isDefined(opts.debugMode) && opts.debugMode != null) {
                _this.options.debugMode = opts.debugMode;
            }
            if (shouldRefreshFrame)
                _this.refreshFrame({ drawBackground: drawBackground });
        };
        this.registerRenderer = function (renderer) {
            _this.renderers.push(renderer);
            return renderer;
        };
        this.getRenderer = function (drawableOrType) {
            for (var i = 0; i < _this.renderers.length; i++) {
                if (_this.renderers[i].canRender(drawableOrType))
                    return _this.renderers[i];
            }
            return _this.defaultRenderer;
        };
        this.getResourceRenderer = function (resOrResId) {
            return _this.getRenderer(resOrResId);
        };
        this.getGraphicRenderer = function (graphicOrType) {
            return _this.getRenderer(graphicOrType);
        };
        this.canUndo = function () { return _this.commando.canUndo(); };
        this.canRedo = function () { return _this.commando.canRedo(); };
        this.undo = function () { return _this.commando.undo(); };
        this.redo = function () { return _this.commando.redo(); };
        this.getName = function () { return "[Grafika " + _this.version + "]"; };
        this.isLogEnabled = function () { return _this.options.debugMode; };
    }
    Grafika.prototype.validateCanvas = function (canvasId) {
        var _this = this;
        if (!canvasId)
            throw new Error('canvasId is required');
        var canvas = (document.querySelector(canvasId) || document.getElementById(canvasId));
        if (!canvas)
            throw new Error('No element found for ' + canvasId + '.');
        canvas.width = 0;
        canvas.height = 0;
        canvas.style.zIndex = "0";
        canvas.style.width = "100%";
        canvas.style.height = "100%";
        canvas.style.position = "absolute";
        canvas.style.left = "0px";
        var canvasBackground = document.createElement('canvas');
        canvasBackground.id = canvas.id + '-background';
        canvasBackground.style.zIndex = "-10";
        canvasBackground.style.width = "100%";
        canvasBackground.style.height = "100%";
        canvasBackground.style.position = "absolute";
        canvasBackground.style.left = "0px";
        var canvasDrawing = document.createElement('canvas');
        canvasDrawing.id = canvas.id + '-drawing';
        canvasDrawing.style.zIndex = "10";
        canvasDrawing.style.width = "100%";
        canvasDrawing.style.height = "100%";
        canvasDrawing.style.left = "0px";
        canvasDrawing.addEventListener('mousedown', function (e) { return _this.onMouseDown(e); });
        canvasDrawing.addEventListener('touchstart', function (e) { return _this.onMouseDown(e); });
        canvasDrawing.addEventListener('mousemove', function (e) { return _this.onMouseMove(e); });
        canvasDrawing.addEventListener('touchmove', function (e) { return _this.onMouseMove(e); });
        canvasDrawing.addEventListener('mouseup', function (e) { return _this.onMouseUp(e); });
        canvasDrawing.addEventListener('touchend', function (e) { return _this.onMouseUp(e); });
        canvasDrawing.addEventListener('mouseleave', function (e) { return _this.onMouseUp(e); });
        canvasDrawing.addEventListener('touchleave', function (e) { return _this.onMouseUp(e); });
        this.context = canvas.getContext('2d');
        this.context.lineJoin = "round";
        this.context.lineCap = "round";
        this.contextBackground = canvasBackground.getContext('2d');
        this.contextBackground.lineJoin = "round";
        this.contextBackground.lineCap = "round";
        this.contextDrawing = canvasDrawing.getContext('2d');
        this.contextDrawing.lineJoin = "round";
        this.contextDrawing.lineCap = "round";
        if (!this.context.setLineDash)
            this.context.setLineDash = function () { };
        if (!this.contextBackground.setLineDash)
            this.contextBackground.setLineDash = function () { };
        if (!this.contextDrawing.setLineDash)
            this.contextDrawing.setLineDash = function () { };
        var oldParent = this.context.canvas.parentElement;
        this.canvasWrapper = document.createElement('div');
        this.canvasWrapper.id = this.context.canvas.id + "-wrapper";
        this.canvasWrapper.style.position = "relative";
        this.canvasWrapper.style.display = "flex";
        canvas.parentElement.removeChild(canvas);
        this.canvasWrapper.appendChild(canvasBackground);
        this.canvasWrapper.appendChild(canvas);
        this.canvasWrapper.appendChild(canvasDrawing);
        oldParent.appendChild(this.canvasWrapper);
        return canvas;
    };
    Grafika.prototype.navigateTo = function (idx, save) {
        if (idx <= 0)
            idx = 0;
        if (save)
            this.saveFrame();
        this.animation.currentFrame = idx;
        this.frame = this.frames[this.animation.currentFrame];
        if (!this.frame) {
            this.frame = this.frameRenderer.create();
        }
        if (save && this.frame.modified)
            this.saveFrame();
        this.refreshFrame({ drawBackground: true });
        this.callback.on(Grafika.EVT_FRAME_CHANGED, this.animation.currentFrame);
        this.callback.on(Grafika.EVT_FRAME_COUNT, this.frames.length);
        this.commando.clearActions();
    };
    Grafika.prototype.onMouseDown = function (e) {
        if (!e || this.isPlaying())
            return;
        if (navigator.userAgent.match(/Android/i)) {
            e.preventDefault();
        }
        if (e.type === 'mousedown' && e.which != 1)
            return;
        if (this.isPlaying())
            return;
        var point = Grafika.calculateCoordinates(this.scale, e);
        if (this.options.drawingMode == Grafika.MODE_SELECT) {
            var newSelectedGraphics = this.findSelectedGraphics(point.x, point.y);
            if (newSelectedGraphics.length > 0) {
                this.isMovingGraphics = true;
                this.selectedGraphics = newSelectedGraphics;
                this.refreshFrame({ keepSelectedGraphics: true });
                this.callback.on(Grafika.EVT_GRAPHIC_SELECTED, this.selectedGraphics[0].id);
                this.graphicBeforeMoving = Grafika.clone(this.selectedGraphics[0]);
                return;
            }
            else {
                this.isMovingGraphics = false;
                this.selectedGraphics = [];
                this.options.drawingMode = Grafika.MODE_PAINT;
                this.refreshFrame({ keepSelectedGraphics: true });
                this.callback.on(Grafika.EVT_GRAPHIC_SELECTED, undefined);
            }
        }
        if (this.options.drawingMode != Grafika.MODE_PAINT)
            return;
        this.isPainting = this.options.drawingMode == Grafika.MODE_PAINT;
        var renderer = this.getGraphicRenderer(this.options.graphic);
        this.currentGraphic = renderer.create();
        this.currentGraphic.isFilled = this.options.graphicFill;
        this.currentGraphic.x = point.x;
        this.currentGraphic.y = point.y;
        this.currentGraphic.brushSize = this.options.brushSize;
        this.currentGraphic.backgroundColor = this.options.backgroundColor;
        this.currentGraphic.foregroundColor = this.options.foregroundColor;
        renderer.invoke(this.context, this.currentGraphic, "mousedown", point.x, point.y);
        renderer.draw(this.contextDrawing, this.currentGraphic);
    };
    Grafika.prototype.onMouseMove = function (e) {
        if (!e || this.isPlaying())
            return;
        var renderer;
        var point = Grafika.calculateCoordinates(this.scale, e);
        if (this.isMovingGraphics && this.selectedGraphics.length > 0) {
            if (!this.lastX)
                this.lastX = point.x;
            if (!this.lastY)
                this.lastY = point.y;
            for (var i = 0; i < this.selectedGraphics.length; i++) {
                this.getGraphicRenderer(this.selectedGraphics[i])
                    .move(this.context, this.selectedGraphics[i], point.x, point.y, this.lastX, this.lastY);
            }
            this.lastX = point.x;
            this.lastY = point.y;
            this.refreshFrame({ keepSelectedGraphics: true });
            return;
        }
        if (this.isPainting && this.currentGraphic) {
            var renderer_1 = this.getGraphicRenderer(this.currentGraphic);
            Grafika.clearCanvas(this.contextDrawing);
            renderer_1.invoke(this.context, this.currentGraphic, 'mousemove', point.x, point.y);
            renderer_1.draw(this.contextDrawing, this.currentGraphic);
        }
    };
    Grafika.prototype.onMouseUp = function (e) {
        if (!e || this.isPlaying())
            return;
        var point = Grafika.calculateCoordinates(this.scale, e);
        Grafika.clearCanvas(this.contextDrawing);
        if (this.isPlaying() && e.type == 'mouseup') {
            this.pause();
            return;
        }
        this.frame.modified = true;
        if (this.isMovingGraphics) {
            this.isMovingGraphics = false;
            this.refreshFrame({ keepSelectedGraphics: true });
            this.callback.on(Grafika.EVT_FRAME_UPDATED, this.frame.index);
            this.callback.on(Grafika.EVT_GRAPHIC_MOVED, this.selectedGraphics[0].id);
            var lastPoint = { x: this.lastX, y: this.lastY };
            if (this.selectedGraphics[0].x != this.graphicBeforeMoving.x || this.selectedGraphics[0].y != this.graphicBeforeMoving.y) {
                this.commando.addAction(new Grafika.GraphicMoved(this, this.selectedGraphics[0], this.graphicBeforeMoving));
            }
            this.graphicBeforeMoving = undefined;
            this.lastX = null;
            this.lastY = null;
            return;
        }
        if (!this.isPainting)
            return;
        var renderer = this.getGraphicRenderer(this.currentGraphic);
        renderer.invoke(this.context, this.currentGraphic, 'mouseup', point.x, point.y);
        if (this.currentGraphic && renderer.isValid(this.currentGraphic)) {
            this.getLayer().graphics.push(this.currentGraphic);
            this.callback.on(Grafika.EVT_FRAME_UPDATED, this.frame.index);
            this.callback.on(Grafika.EVT_GRAPHIC_CREATED, this.currentGraphic.id);
            this.commando.addAction(new Grafika.GraphicCreated(this, this.currentGraphic));
        }
        this.refreshFrame();
        this.isPainting = false;
    };
    return Grafika;
}());
var Grafika;
(function (Grafika) {
    Grafika.Plugins = [];
    Grafika.VERSION = '1.0.4';
    Grafika.MODE_NONE = 'none', Grafika.MODE_PAINT = 'paint', Grafika.MODE_SELECT = 'select';
    Grafika.EVT_INITIALIZED = "initialized", Grafika.EVT_DESTROYED = "destroyed", Grafika.EVT_PLAYING = "playing", Grafika.EVT_ANIMATION_SAVED = "animationSaved", Grafika.EVT_FRAME_COUNT = "frameCount", Grafika.EVT_FRAME_UPDATED = "frameUpdated", Grafika.EVT_FRAME_CHANGED = "frameChanged", Grafika.EVT_FRAME_SAVED = "frameSaved", Grafika.EVT_GRAPHIC_CREATED = "graphicCreated", Grafika.EVT_GRAPHIC_SELECTED = "graphicSelected", Grafika.EVT_GRAPHIC_MOVED = "graphicMoved", Grafika.EVT_GRAPHIC_COPIED = "graphicCopied", Grafika.EVT_GRAPHIC_PASTED = "graphicPasted", Grafika.EVT_GRAPHIC_DELETED = "graphicDeleted";
    var DefaultOption = (function () {
        function DefaultOption() {
            this.backgroundColor = '#ffffff';
            this.foregroundColor = '#000000';
            this.brushSize = 5;
            this.graphic = 'freeform';
            this.graphicFill = false;
            this.useCarbonCopy = true;
            this.useNavigationText = true;
            this.navigationTextX = 15;
            this.navigationTextY = 40;
            this.debugMode = true;
            this.drawingMode = 'none';
            this.loop = false;
        }
        return DefaultOption;
    }());
    Grafika.DefaultOption = DefaultOption;
    var DefaultCallback = (function () {
        function DefaultCallback(grafika) {
            var _this = this;
            this.grafika = grafika;
            this.on = function (eventName, obj) { return Grafika.log(_this.grafika, '[callback] ' + eventName, obj); };
        }
        return DefaultCallback;
    }());
    Grafika.DefaultCallback = DefaultCallback;
})(Grafika || (Grafika = {}));
var Grafika;
(function (Grafika) {
    var Renderer = (function () {
        function Renderer(grafika) {
            this.grafika = grafika;
            if (!grafika)
                throw new Error("An instance of grafika is required");
        }
        Renderer.prototype.canRender = function (drawable) {
            return (drawable && drawable.type === this.getRenderingType() || drawable === this.getRenderingType());
        };
        return Renderer;
    }());
    Grafika.Renderer = Renderer;
    var DefaultRenderer = (function (_super) {
        __extends(DefaultRenderer, _super);
        function DefaultRenderer() {
            _super.apply(this, arguments);
        }
        DefaultRenderer.prototype.create = function (drawable) {
            return null;
        };
        DefaultRenderer.prototype.draw = function (context, drawable) {
        };
        DefaultRenderer.prototype.getRenderingType = function () {
            return null;
        };
        DefaultRenderer.prototype.canRender = function (drawable) {
            return true;
        };
        return DefaultRenderer;
    }(Renderer));
    Grafika.DefaultRenderer = DefaultRenderer;
    var AnimationRenderer = (function (_super) {
        __extends(AnimationRenderer, _super);
        function AnimationRenderer() {
            _super.apply(this, arguments);
        }
        AnimationRenderer.prototype.create = function (anim) {
            if (!anim)
                anim = {};
            anim._id = anim._id;
            anim.localId = anim.localId || Grafika.randomUid();
            anim.name = anim.name || anim.localId;
            anim.description = anim.description || anim.description;
            anim.timer = anim.timer || 500;
            anim.width = anim.width || window.innerWidth;
            anim.height = anim.height || window.innerHeight;
            anim.dateCreated = anim.dateCreated || Date.now();
            anim.dateModified = anim.dateModified || anim.dateCreated;
            anim.views = anim.views || 0;
            anim.rating = anim.rating || 0;
            anim.category = anim.category || anim.category;
            anim.isPublic = anim.isPublic || anim.isPublic;
            anim.author = anim.author || anim.author;
            anim.userId = anim.userId || anim.userId;
            anim.thumbnailUrl = anim.thumbnailUrl || anim.thumbnailUrl;
            anim.totalFrame = anim.totalFrame || 0;
            anim.currentFrame = anim.currentFrame || 0;
            anim.modified = anim.modified || false;
            anim.resources = anim.resources || [];
            return anim;
        };
        AnimationRenderer.prototype.draw = function (context, drawable) {
            throw new Error();
        };
        AnimationRenderer.prototype.getRenderingType = function () {
            return "animation";
        };
        return AnimationRenderer;
    }(Renderer));
    Grafika.AnimationRenderer = AnimationRenderer;
    var FrameRenderer = (function (_super) {
        __extends(FrameRenderer, _super);
        function FrameRenderer(grafika) {
            _super.call(this, grafika);
            this.backgroundColorRenderer = this.grafika.getResourceRenderer("background-color");
            this.backgroundImageRenderer = this.grafika.getResourceRenderer("background-image");
            this.backgroundLayerRenderer = this.grafika.getResourceRenderer("background-layer");
            this.layerRenderer = this.grafika.getRenderer("layer");
        }
        FrameRenderer.prototype.create = function (frame) {
            if (!frame) {
                frame = { type: "frame" };
            }
            frame.id = frame.id || Grafika.randomUid();
            frame.index = (frame.index >= 0 ? frame.index : (this.grafika.getAnimation().currentFrame || 0));
            frame.modified = frame.modified || true;
            frame.backgroundResourceId = frame.backgroundResourceId || undefined;
            frame.backgroundColor = frame.backgroundColor || this.grafika.getOptions().backgroundColor;
            frame.foregroundColor = frame.foregroundColor || this.grafika.getOptions().foregroundColor;
            frame.layers = frame.layers || [this.layerRenderer.create()];
            frame.type = "frame";
            return frame;
        };
        FrameRenderer.prototype.draw = function (context, frame) {
            var options = this.grafika.getOptions();
            var animation = this.grafika.getAnimation();
            var frames = this.grafika.getFrames();
            var scale = this.grafika.getScale();
            if (options.useCarbonCopy && animation.currentFrame > 0) {
                var previousFrame = frames[animation.currentFrame - 1];
                if (previousFrame) {
                    this.drawLayers(context, previousFrame, { carbonCopy: true });
                }
                context.beginPath();
            }
            this.drawLayers(context, frame);
            if (options.useNavigationText) {
                context.fillStyle = 'gray';
                context.font = '25px verdana';
                context["fontWeight"] = 'bold';
                context.fillText((animation.currentFrame + 1) + ' / ' + (frames.length), options.navigationTextX * scale.x, options.navigationTextY * scale.y);
            }
        };
        FrameRenderer.prototype.drawBackground = function (context, frame, callback) {
            this.backgroundColorRenderer.draw(context, frame);
            if (!frame.backgroundResourceId) {
                if (callback)
                    callback();
                return;
            }
            var resource = this.grafika.getResource(frame.backgroundResourceId);
            this.grafika.getResourceRenderer(resource).draw(context, resource, callback);
        };
        FrameRenderer.prototype.drawLayers = function (context, frame, options) {
            if (options === void 0) { options = { carbonCopy: false }; }
            var selectedGraphics = this.grafika.getSelectedGraphics();
            var currentGraphic = this.grafika.getCurrentGraphic();
            for (var i = 0; i < selectedGraphics.length; i++) {
                var g = selectedGraphics[i];
                var renderer = this.grafika.getGraphicRenderer(g);
                var rect = renderer.getBounds(g);
                var offset = g.brushSize / 2;
                context.lineWidth = 2;
                context.setLineDash([2, 4]);
                if (frame.backgroundColor != '#000000')
                    context.strokeStyle = 'rgba(0, 0, 0, 0.5)';
                else
                    context.strokeStyle = 'rgba(255, 255, 255, 0.6)';
                context.strokeRect(rect.x - offset - 2, rect.y - offset - 2, rect.width + (offset * 2) + 4, rect.height + (offset * 2) + 4);
            }
            for (var i = 0; i < frame.layers.length; i++) {
                this.layerRenderer.draw(context, frame.layers[i], options);
            }
            if (currentGraphic) {
                var renderer = this.grafika.getGraphicRenderer(currentGraphic);
                renderer.draw(context, currentGraphic);
            }
        };
        FrameRenderer.prototype.getRenderingType = function () {
            return "frame";
        };
        return FrameRenderer;
    }(Renderer));
    Grafika.FrameRenderer = FrameRenderer;
    var LayerRenderer = (function (_super) {
        __extends(LayerRenderer, _super);
        function LayerRenderer(grafika) {
            _super.call(this, grafika);
        }
        LayerRenderer.prototype.create = function (layer) {
            if (!layer) {
                layer = { type: "layer" };
            }
            layer.id = layer.id || Grafika.randomUid();
            layer.index = layer.index || 0;
            layer.graphics = layer.graphics || [];
            return layer;
        };
        LayerRenderer.prototype.draw = function (context, layer, options) {
            if (options === void 0) { options = { carbonCopy: false }; }
            var g;
            context.setLineDash([]);
            context.lineJoin = "round";
            context.lineCap = "round";
            for (var i = 0; i < layer.graphics.length; i++) {
                g = layer.graphics[i];
                if (options.carbonCopy) {
                    var rgb = Grafika.hexToRgb(g.foregroundColor);
                    g.foregroundAlpha = 'rgba(' + rgb.r + ',' + rgb.g + ',' + rgb.b + ', 0.2)';
                }
                this.grafika.getGraphicRenderer(g).draw(context, g);
                delete g.foregroundAlpha;
            }
        };
        LayerRenderer.prototype.getRenderingType = function () {
            return "layer";
        };
        return LayerRenderer;
    }(Renderer));
    Grafika.LayerRenderer = LayerRenderer;
    var ResourceRenderer = (function (_super) {
        __extends(ResourceRenderer, _super);
        function ResourceRenderer() {
            _super.apply(this, arguments);
        }
        ResourceRenderer.prototype.create = function (resource) {
            if (!resource)
                resource = { type: this.getRenderingType() };
            resource.id = resource.id || Grafika.randomUid("res");
            resource.type = resource.type || this.getRenderingType();
            return resource;
        };
        return ResourceRenderer;
    }(Renderer));
    Grafika.ResourceRenderer = ResourceRenderer;
    var BackgroundLayerRenderer = (function (_super) {
        __extends(BackgroundLayerRenderer, _super);
        function BackgroundLayerRenderer() {
            _super.apply(this, arguments);
        }
        BackgroundLayerRenderer.prototype.create = function (resource) {
            resource = _super.prototype.create.call(this, resource);
            resource.graphics = resource.graphics || undefined;
            return resource;
        };
        BackgroundLayerRenderer.prototype.draw = function (context, resource, callback) {
            var g;
            context.setLineDash([]);
            context.lineJoin = "round";
            context.lineCap = "round";
            for (var i = 0; i < resource.graphics.length; i++) {
                g = resource.graphics[i];
                this.grafika.getGraphicRenderer(g).draw(context, g);
            }
            if (callback)
                callback(undefined, resource);
        };
        BackgroundLayerRenderer.prototype.getRenderingType = function () {
            return "background-layer";
        };
        return BackgroundLayerRenderer;
    }(ResourceRenderer));
    Grafika.BackgroundLayerRenderer = BackgroundLayerRenderer;
    var BackgroundColorRenderer = (function (_super) {
        __extends(BackgroundColorRenderer, _super);
        function BackgroundColorRenderer() {
            _super.apply(this, arguments);
        }
        BackgroundColorRenderer.prototype.create = function (resource) {
            resource = _super.prototype.create.call(this, resource);
            resource.backgroundColor = resource.backgroundColor || "#ffffff";
            return resource;
        };
        BackgroundColorRenderer.prototype.draw = function (context, resource, callback) {
            context.beginPath();
            context.rect(-2, -2, parseInt(context.canvas.getAttribute('width')) + 2, parseInt(context.canvas.getAttribute('height')) + 2);
            context.fillStyle = resource.backgroundColor;
            context.fill();
            if (callback)
                callback(undefined, resource);
        };
        BackgroundColorRenderer.prototype.getRenderingType = function () {
            return "background-color";
        };
        return BackgroundColorRenderer;
    }(ResourceRenderer));
    Grafika.BackgroundColorRenderer = BackgroundColorRenderer;
    var BackgroundImageRenderer = (function (_super) {
        __extends(BackgroundImageRenderer, _super);
        function BackgroundImageRenderer() {
            _super.apply(this, arguments);
        }
        BackgroundImageRenderer.prototype.create = function (resource) {
            resource = _super.prototype.create.call(this, resource);
            resource.mime = resource.mime || undefined;
            resource.base64 = resource.base64 || undefined;
            resource.url = resource.url || undefined;
            return resource;
        };
        BackgroundImageRenderer.prototype.draw = function (context, resource, callback) {
            var img = new Image();
            img.onload = function () {
                context.drawImage(img, 0, 0, parseInt(context.canvas.getAttribute('width')), parseInt(context.canvas.getAttribute('height')));
                if (callback)
                    callback(undefined, resource);
            };
            img.onerror = function (e) {
                if (callback)
                    callback(new Error("Unable to render image"), resource);
            };
            img.crossOrigin = "Anonymous";
            img.src = this.from(resource, callback);
        };
        BackgroundImageRenderer.prototype.getRenderingType = function () {
            return "background-image";
        };
        BackgroundImageRenderer.prototype.from = function (resource, callback) {
            if (resource.base64)
                return this.fromBase64(resource);
            if (resource.url)
                return this.fromUrl(resource);
            callback(new Error("Unable to read image data"), resource);
        };
        BackgroundImageRenderer.prototype.fromBase64 = function (resource) {
            return "data:" + resource.mime + ";base64," + resource.base64;
        };
        BackgroundImageRenderer.prototype.fromUrl = function (resource) {
            return resource.url;
        };
        return BackgroundImageRenderer;
    }(ResourceRenderer));
    Grafika.BackgroundImageRenderer = BackgroundImageRenderer;
    var GraphicRenderer = (function (_super) {
        __extends(GraphicRenderer, _super);
        function GraphicRenderer(grafika) {
            _super.call(this, grafika);
        }
        GraphicRenderer.prototype.create = function (graphic) {
            if (!graphic)
                graphic = { type: this.getRenderingType() };
            graphic.id = graphic.id || Grafika.randomUid();
            graphic.x = graphic.x || 0;
            graphic.y = graphic.y || 0;
            graphic.width = graphic.width || 10;
            graphic.height = graphic.height || 10;
            graphic.backgroundColor = graphic.backgroundColor || "#ffffff";
            graphic.foregroundColor = graphic.foregroundColor || "#000000";
            graphic.foregroundAlpha = graphic.foregroundAlpha || undefined;
            graphic.isFilled = (Grafika.isDefined(graphic.isFilled) && graphic.isFilled != null) ? graphic.isFilled : false;
            graphic.isVisible = (Grafika.isDefined(graphic.isVisible) && graphic.isVisible != null) ? graphic.isVisible : true;
            graphic.brushSize = graphic.brushSize || 5;
            graphic.type = graphic.type || undefined;
            return graphic;
        };
        GraphicRenderer.prototype.getBounds = function (graphic) {
            return {
                x: graphic.width > 0 ? graphic.x : graphic.x + graphic.width,
                y: graphic.height > 0 ? graphic.y : graphic.y + graphic.height,
                width: Math.abs(graphic.width),
                height: Math.abs(graphic.height)
            };
        };
        GraphicRenderer.prototype.contains = function (graphic, x, y) {
            var bounds = this.getBounds(graphic);
            return bounds.x < x &&
                bounds.x + bounds.width > x &&
                bounds.y < y && bounds.y + bounds.height > y;
        };
        GraphicRenderer.prototype.isValid = function (graphic) {
            return Math.abs(graphic.width) > 20 && Math.abs(graphic.height) > 20;
        };
        GraphicRenderer.prototype.draw = function (context, graphic) {
            context.lineWidth = graphic.brushSize > 1 ? graphic.brushSize : 1;
            context.strokeStyle = graphic.foregroundAlpha || graphic.foregroundColor;
            context.fillStyle = graphic.foregroundAlpha || graphic.foregroundColor;
            this.onDraw(context, graphic);
        };
        GraphicRenderer.prototype.move = function (context, graphic, x, y, lastX, lastY) {
            this.onMove(context, graphic, x, y, lastX, lastY);
        };
        GraphicRenderer.prototype.invoke = function (context, graphic, eventType, eventX, eventY) {
            this.onEvent(context, graphic, eventType, eventX, eventY);
        };
        return GraphicRenderer;
    }(Renderer));
    Grafika.GraphicRenderer = GraphicRenderer;
    var FreeformRenderer = (function (_super) {
        __extends(FreeformRenderer, _super);
        function FreeformRenderer() {
            _super.apply(this, arguments);
        }
        FreeformRenderer.prototype.create = function (graphic) {
            graphic = _super.prototype.create.call(this, graphic);
            graphic.points = graphic.points || [];
            return graphic;
        };
        FreeformRenderer.prototype.calculateBounds = function (graphic) {
            var rect = {
                x: graphic.x,
                y: graphic.y,
                width: graphic.x,
                height: graphic.y,
            };
            for (var pI = 0; pI < graphic.points.length; pI++) {
                var p = graphic.points[pI];
                if (rect.x > p.x)
                    rect.x = p.x;
                if (rect.y > p.y)
                    rect.y = p.y;
                if (rect.width < p.x)
                    rect.width = p.x;
                if (rect.height < p.y)
                    rect.height = p.y;
            }
            rect.width = rect.width - rect.x;
            rect.height = rect.height - rect.y;
            return rect;
        };
        FreeformRenderer.prototype.getBounds = function (graphic) {
            var rect = this.calculateBounds(graphic);
            if (rect.height - rect.y < 10 || rect.width - rect.x < 10) {
                rect.y -= 5;
                rect.x -= 5;
                rect.height += 10;
                rect.width += 10;
            }
            return rect;
        };
        FreeformRenderer.prototype.isValid = function (graphic) {
            var rect = this.calculateBounds(graphic);
            return rect.width > 5 || rect.height > 5;
        };
        FreeformRenderer.prototype.onDraw = function (context, graphic) {
            context.beginPath();
            context.moveTo(graphic.x, graphic.y);
            for (var i = 0; i < graphic.points.length; i++) {
                this.point = graphic.points[i];
                context.lineTo(this.point.x, this.point.y);
            }
            if (graphic.isFilled)
                context.fill();
            else
                context.stroke();
        };
        FreeformRenderer.prototype.onMove = function (context, graphic, x, y, lastX, lastY) {
            var lastGX = graphic.x;
            var lastGY = graphic.y;
            graphic.x = graphic.x + (x - lastX);
            graphic.y = graphic.y + (y - lastY);
            var deltaX = lastGX - graphic.x;
            var deltaY = lastGY - graphic.y;
            for (var i = 0; i < graphic.points.length; i++) {
                graphic.points[i].x -= deltaX;
                graphic.points[i].y -= deltaY;
            }
        };
        FreeformRenderer.prototype.onEvent = function (context, graphic, eventType, eventX, eventY) {
            switch (eventType) {
                case "mousemove":
                    graphic.points.push({ x: eventX, y: eventY });
                    break;
            }
        };
        FreeformRenderer.prototype.getRenderingType = function () {
            return "freeform";
        };
        return FreeformRenderer;
    }(GraphicRenderer));
    Grafika.FreeformRenderer = FreeformRenderer;
    var LineRenderer = (function (_super) {
        __extends(LineRenderer, _super);
        function LineRenderer() {
            _super.apply(this, arguments);
        }
        LineRenderer.prototype.create = function (graphic) {
            graphic = _super.prototype.create.call(this, graphic);
            graphic.endX = graphic.endX || graphic.x;
            graphic.endY = graphic.endY || graphic.y;
            return graphic;
        };
        LineRenderer.prototype.getBounds = function (graphic) {
            return {
                x: graphic.x < graphic.endX ? graphic.x : graphic.endX,
                y: graphic.y < graphic.endY ? graphic.y : graphic.endY,
                width: graphic.x > graphic.endX ? graphic.x - graphic.endX : graphic.endX - graphic.x,
                height: graphic.y > graphic.endY ? graphic.y - graphic.endY : graphic.endY - graphic.y,
            };
        };
        LineRenderer.prototype.isValid = function (graphic) {
            return Math.abs(graphic.endX - graphic.x) > 20 || Math.abs(graphic.endY - graphic.y) > 20;
        };
        LineRenderer.prototype.onDraw = function (context, graphic) {
            context.beginPath();
            context.moveTo(graphic.x, graphic.y);
            context.lineTo(graphic.endX, graphic.endY);
            context.stroke();
        };
        LineRenderer.prototype.onMove = function (context, graphic, x, y, lastX, lastY) {
            graphic.x = graphic.x + (x - lastX);
            graphic.y = graphic.y + (y - lastY);
            graphic.endX = graphic.endX + (x - lastX);
            graphic.endY = graphic.endY + (y - lastY);
        };
        LineRenderer.prototype.onEvent = function (context, graphic, eventType, eventX, eventY) {
            switch (eventType) {
                case "mousedown":
                    graphic.x = eventX;
                    graphic.y = eventY;
                case "mousemove":
                    graphic.endX = eventX;
                    graphic.endY = eventY;
                    break;
            }
        };
        LineRenderer.prototype.getRenderingType = function () {
            return "line";
        };
        return LineRenderer;
    }(GraphicRenderer));
    Grafika.LineRenderer = LineRenderer;
    var RectangleRenderer = (function (_super) {
        __extends(RectangleRenderer, _super);
        function RectangleRenderer() {
            _super.apply(this, arguments);
        }
        RectangleRenderer.prototype.onDraw = function (context, graphic) {
            if (graphic.isFilled)
                context.fillRect(graphic.x, graphic.y, graphic.width, graphic.height);
            else {
                context.strokeRect(graphic.x, graphic.y, graphic.width, graphic.height);
            }
        };
        RectangleRenderer.prototype.onMove = function (context, graphic, x, y, lastX, lastY) {
            graphic.x = graphic.x + (x - lastX);
            graphic.y = graphic.y + (y - lastY);
        };
        RectangleRenderer.prototype.onEvent = function (context, graphic, eventType, eventX, eventY) {
            switch (eventType) {
                case "mousemove":
                    graphic.width = eventX - graphic.x;
                    graphic.height = eventY - graphic.y;
                    break;
            }
        };
        RectangleRenderer.prototype.getRenderingType = function () {
            return "rectangle";
        };
        return RectangleRenderer;
    }(GraphicRenderer));
    Grafika.RectangleRenderer = RectangleRenderer;
    var SquareRenderer = (function (_super) {
        __extends(SquareRenderer, _super);
        function SquareRenderer() {
            _super.apply(this, arguments);
        }
        SquareRenderer.prototype.onEvent = function (context, graphic, eventType, eventX, eventY) {
            switch (eventType) {
                case "mousemove":
                    graphic.width = eventX - graphic.x;
                    graphic.height = eventY - graphic.y;
                    graphic.width = graphic.width > graphic.height ? graphic.height : graphic.width;
                    graphic.height = graphic.width > graphic.height ? graphic.height : graphic.width;
                    break;
            }
        };
        SquareRenderer.prototype.getRenderingType = function () {
            return "square";
        };
        return SquareRenderer;
    }(RectangleRenderer));
    Grafika.SquareRenderer = SquareRenderer;
    var CircleRenderer = (function (_super) {
        __extends(CircleRenderer, _super);
        function CircleRenderer() {
            _super.apply(this, arguments);
        }
        CircleRenderer.prototype.create = function (graphic) {
            graphic = _super.prototype.create.call(this, graphic);
            graphic.radius = graphic.radius || 10;
            return graphic;
        };
        CircleRenderer.prototype.getBounds = function (graphic) {
            return {
                x: graphic.x - graphic.radius,
                y: graphic.y - graphic.radius,
                width: graphic.radius * 2,
                height: graphic.radius * 2,
            };
        };
        CircleRenderer.prototype.isValid = function (graphic) {
            return graphic.radius > 5;
        };
        CircleRenderer.prototype.onDraw = function (context, graphic) {
            context.beginPath();
            context.arc(graphic.x, graphic.y, graphic.radius, 0, 2 * Math.PI);
            if (graphic.isFilled)
                context.fill();
            else
                context.stroke();
        };
        CircleRenderer.prototype.onEvent = function (context, graphic, eventType, eventX, eventY) {
            switch (eventType) {
                case "mousemove":
                    graphic.radius = Math.abs(eventX - graphic.x);
                    break;
            }
        };
        CircleRenderer.prototype.getRenderingType = function () {
            return "circle";
        };
        return CircleRenderer;
    }(RectangleRenderer));
    Grafika.CircleRenderer = CircleRenderer;
    var OvalRenderer = (function (_super) {
        __extends(OvalRenderer, _super);
        function OvalRenderer() {
            _super.apply(this, arguments);
        }
        OvalRenderer.prototype.create = function (graphic) {
            graphic = _super.prototype.create.call(this, graphic);
            graphic.radiusY = graphic.radiusY || 5;
            return graphic;
        };
        OvalRenderer.prototype.getBounds = function (graphic) {
            return {
                x: graphic.x - graphic.radius,
                y: graphic.y - graphic.radiusY,
                width: graphic.radius * 2,
                height: graphic.radiusY * 2,
            };
        };
        OvalRenderer.prototype.isValid = function (graphic) {
            return graphic.radius > 10 && graphic.radiusY > 10;
        };
        OvalRenderer.prototype.onDraw = function (context, graphic) {
            context.beginPath();
            context.ellipse(graphic.x, graphic.y, graphic.radius, graphic.radiusY, 0, 0, 2 * Math.PI);
            if (graphic.isFilled)
                context.fill();
            else
                context.stroke();
        };
        OvalRenderer.prototype.onEvent = function (context, graphic, eventType, eventX, eventY) {
            switch (eventType) {
                case "mousemove":
                    graphic.radius = Math.abs(eventX - graphic.x);
                    graphic.radiusY = Math.abs(eventY - graphic.y);
                    break;
            }
        };
        OvalRenderer.prototype.getRenderingType = function () {
            return "oval";
        };
        return OvalRenderer;
    }(CircleRenderer));
    Grafika.OvalRenderer = OvalRenderer;
    var TriangleRenderer = (function (_super) {
        __extends(TriangleRenderer, _super);
        function TriangleRenderer() {
            _super.apply(this, arguments);
        }
        TriangleRenderer.prototype.onDraw = function (context, graphic) {
            context.beginPath();
            context.moveTo(graphic.x + (graphic.width / 2), graphic.y);
            context.lineTo(graphic.x, graphic.y + graphic.height);
            context.lineTo(graphic.x + graphic.width, graphic.y + graphic.height);
            context.closePath();
            if (graphic.isFilled)
                context.fill();
            else
                context.stroke();
        };
        TriangleRenderer.prototype.getRenderingType = function () {
            return "triangle";
        };
        return TriangleRenderer;
    }(RectangleRenderer));
    Grafika.TriangleRenderer = TriangleRenderer;
    var TextRenderer = (function (_super) {
        __extends(TextRenderer, _super);
        function TextRenderer() {
            _super.apply(this, arguments);
        }
        TextRenderer.prototype.create = function (graphic) {
            if (!graphic) {
                graphic = {
                    isFilled: true,
                    height: 25
                };
            }
            graphic = _super.prototype.create.call(this, graphic);
            graphic.text = graphic.text || "";
            graphic.font = graphic.font || "verdana";
            graphic.fontWeight = graphic.fontWeight || "normal";
            return graphic;
        };
        TextRenderer.prototype.isValid = function (graphic) {
            return graphic.text && graphic.text.length > 0;
        };
        TextRenderer.prototype.onDraw = function (context, graphic) {
            context.font = graphic.height + 'px ' + graphic.font;
            if (graphic.isFilled) {
                context.fillStyle = graphic.foregroundAlpha || graphic.foregroundColor;
                context.fillText(graphic.text, graphic.x, graphic.y + graphic.height);
            }
            else {
                context.strokeStyle = graphic.foregroundAlpha || graphic.foregroundColor;
                context.strokeText(graphic.text, graphic.x, graphic.y + graphic.height);
            }
        };
        TextRenderer.prototype.onEvent = function (context, graphic, eventType, eventX, eventY) {
            switch (eventType) {
                case "mouseup":
                    graphic.text = this.prompt('Insert text');
                    this.drawFocusRectangle(context, graphic);
                    this.draw(context, graphic);
                    break;
            }
        };
        TextRenderer.prototype.drawFocusRectangle = function (context, graphic) {
            var rect = context.measureText(graphic.text);
            graphic.width = rect.width;
            context.lineWidth = 1;
            context.setLineDash([2, 4]);
            context.strokeStyle = graphic.foregroundColor;
            context.rect(graphic.x, graphic.y, graphic.width, graphic.height);
        };
        TextRenderer.prototype.prompt = function (text, title) {
            return window.prompt(text, title);
        };
        TextRenderer.prototype.getRenderingType = function () {
            return "text";
        };
        return TextRenderer;
    }(RectangleRenderer));
    Grafika.TextRenderer = TextRenderer;
})(Grafika || (Grafika = {}));
var Grafika;
(function (Grafika) {
    var CommandManager = (function () {
        function CommandManager(grafika) {
            var _this = this;
            this.grafika = grafika;
            this.undoActions = [];
            this.redoActions = [];
            this.clearActions = function () {
                _this.undoActions = [];
                _this.redoActions = [];
            };
            this.addAction = function (action) {
                _this.undoActions.push(action);
                _this.redoActions = [];
            };
            this.canUndo = function () { return _this.undoActions.length > 0; };
            this.canRedo = function () { return _this.redoActions.length > 0; };
            this.undo = function () {
                if (!_this.canUndo()) {
                    Grafika.log(_this.grafika, 'No undo!');
                    return;
                }
                var action = _this.undoActions.pop();
                action.undo();
                _this.redoActions.push(action);
                Grafika.log(_this.grafika, "Undo: " + action.event);
            };
            this.redo = function () {
                if (!_this.canRedo()) {
                    Grafika.log(_this.grafika, 'No redo!');
                    return;
                }
                var action = _this.redoActions.pop();
                action.redo();
                _this.undoActions.push(action);
                Grafika.log(_this.grafika, "Redo: " + action.event);
            };
        }
        ;
        return CommandManager;
    }());
    Grafika.CommandManager = CommandManager;
    var GraphicAction = (function () {
        function GraphicAction(grafika, graphic, event) {
            var _this = this;
            this.undo = function () {
                _this.performUndo();
                _this.grafika.refreshFrame();
            };
            this.redo = function () {
                _this.performRedo();
                _this.grafika.refreshFrame();
            };
            this.getRenderer = function () { return _this.grafika.getGraphicRenderer(_this.graphic); };
            this.grafika = grafika;
            this.event = event;
            this.graphic = Grafika.clone(graphic);
        }
        return GraphicAction;
    }());
    Grafika.GraphicAction = GraphicAction;
    var GraphicCreated = (function (_super) {
        __extends(GraphicCreated, _super);
        function GraphicCreated(grafika, graphic) {
            _super.call(this, grafika, graphic, Grafika.EVT_GRAPHIC_CREATED);
        }
        GraphicCreated.prototype.performUndo = function () {
            this.grafika.deleteGraphic(this.graphic.id, false);
        };
        GraphicCreated.prototype.performRedo = function () {
            this.grafika.getFrame().layers[0].graphics.push(this.graphic);
        };
        return GraphicCreated;
    }(GraphicAction));
    Grafika.GraphicCreated = GraphicCreated;
    var GraphicDeleted = (function (_super) {
        __extends(GraphicDeleted, _super);
        function GraphicDeleted(grafika, graphic) {
            _super.call(this, grafika, graphic, Grafika.EVT_GRAPHIC_DELETED);
        }
        GraphicDeleted.prototype.performUndo = function () {
            this.grafika.frame.layers[0].graphics.push(this.graphic);
        };
        GraphicDeleted.prototype.performRedo = function () {
            this.grafika.deleteGraphic(this.graphic.id, false);
        };
        return GraphicDeleted;
    }(GraphicAction));
    Grafika.GraphicDeleted = GraphicDeleted;
    var GraphicMoved = (function (_super) {
        __extends(GraphicMoved, _super);
        function GraphicMoved(grafika, graphic, previous) {
            _super.call(this, grafika, graphic, Grafika.EVT_GRAPHIC_MOVED);
            this.previous = Grafika.clone(previous);
        }
        GraphicMoved.prototype.performUndo = function () {
            this.grafika.deleteGraphic(this.graphic.id, false);
            this.grafika.frame.layers[0].graphics.push(this.previous);
        };
        GraphicMoved.prototype.performRedo = function () {
            this.grafika.deleteGraphic(this.graphic.id, false);
            this.grafika.frame.layers[0].graphics.push(this.graphic);
        };
        return GraphicMoved;
    }(GraphicAction));
    Grafika.GraphicMoved = GraphicMoved;
    var GraphicPasted = (function (_super) {
        __extends(GraphicPasted, _super);
        function GraphicPasted(grafika, graphic) {
            _super.call(this, grafika, graphic);
            this.event = Grafika.EVT_GRAPHIC_PASTED;
        }
        return GraphicPasted;
    }(GraphicCreated));
    Grafika.GraphicPasted = GraphicPasted;
})(Grafika || (Grafika = {}));
var Grafika;
(function (Grafika) {
    var COLOR_SHORTHAND_REGEX = /^#?([a-f\d])([a-f\d])([a-f\d])$/i;
    var COLOR_HEX_SHORTHAND_REGEX = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i;
    function isDefined(any) {
        return typeof any !== "undefined";
    }
    Grafika.isDefined = isDefined;
    function isUndefined(any) {
        return typeof any === "undefined";
    }
    Grafika.isUndefined = isUndefined;
    function log(src) {
        var optionalParams = [];
        for (var _i = 1; _i < arguments.length; _i++) {
            optionalParams[_i - 1] = arguments[_i];
        }
        if (!src.isLogEnabled())
            return;
        if (optionalParams.length == 0)
            return;
        console.log(src.getName(), optionalParams.join(","));
    }
    Grafika.log = log;
    function randomUid(prefix) {
        return (prefix || "") + (("000000" + (Math.random() * Math.pow(36, 6) << 0).toString(36)).slice(-6));
    }
    Grafika.randomUid = randomUid;
    function hexToRgb(hex) {
        hex = hex.replace(COLOR_SHORTHAND_REGEX, function (m, r, g, b) {
            return r + r + g + g + b + b;
        });
        var result = COLOR_HEX_SHORTHAND_REGEX.exec(hex);
        return result ? { r: parseInt(result[1], 16), g: parseInt(result[2], 16), b: parseInt(result[3], 16) } : { r: 0, g: 0, b: 0 };
    }
    Grafika.hexToRgb = hexToRgb;
    function calculateCoordinates(scale, e) {
        var eX = e.offsetX;
        var eY = e.offsetY;
        if (e.changedTouches) {
            eX = e.changedTouches[0].pageX;
            eY = e.changedTouches[0].pageY;
        }
        return {
            x: +(eX * scale.x).toFixed(1),
            y: +(eY * scale.y).toFixed(1)
        };
    }
    Grafika.calculateCoordinates = calculateCoordinates;
    function calculateFurthestDistance(x, y, graphic) {
        var sideA = y - graphic.y;
        var sideB = x - graphic.x;
        return Math.sqrt(Math.pow(sideA, 2) + Math.pow(sideB, 2));
    }
    Grafika.calculateFurthestDistance = calculateFurthestDistance;
    function clearCanvas(context) {
        context.canvas.width = context.canvas.width;
        context.lineJoin = "round";
        context.lineCap = "round";
    }
    Grafika.clearCanvas = clearCanvas;
    function clone(any) {
        return JSON.parse(JSON.stringify(any));
    }
    Grafika.clone = clone;
    (function () {
        var lastTime = 0;
        var vendors = ['ms', 'moz', 'webkit', 'o'];
        for (var x = 0; x < vendors.length && !window.requestAnimationFrame; ++x) {
            window.requestAnimationFrame = window[vendors[x] + 'RequestAnimationFrame'];
            window.cancelAnimationFrame = window[vendors[x] + 'CancelAnimationFrame']
                || window[vendors[x] + 'CancelRequestAnimationFrame'];
        }
        if (!window.requestAnimationFrame)
            window.requestAnimationFrame = function (callback, element) {
                var currTime = new Date().getTime();
                var timeToCall = Math.max(0, 16 - (currTime - lastTime));
                var id = window.setTimeout(function () { callback(currTime + timeToCall); }, timeToCall);
                lastTime = currTime + timeToCall;
                return id;
            };
        if (!window.cancelAnimationFrame)
            window.cancelAnimationFrame = function (id) { return clearTimeout(id); };
    })();
})(Grafika || (Grafika = {}));
//# sourceMappingURL=grafika.js.map