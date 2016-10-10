var __extends = (this && this.__extends) || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
};
var Grafika = (function () {
    function Grafika() {
        var _this = this;
        this.animation = {};
        this.selectedGraphics = [];
        this.isMovingGraphics = false;
        this.options = {
            backgroundColor: '#ffffff',
            foregroundColor: '#000000',
            brushSize: 2,
            graphic: 'freeform',
            graphicFill: false,
            useCarbonCopy: true,
            useNavigationText: true,
            debugMode: true,
            drawingMode: 'none',
            loop: false
        };
        this.callback = {
            on: function (eventName, obj) { return _this.log('[callback] ' + eventName, obj); }
        };
        this.plugins = [];
        this.renderers = [];
        this.version = Grafika.VERSION;
    }
    Grafika.prototype.initialize = function (canvasId, opts, anim) {
        var _this = this;
        this.canvas = this.validateCanvas(canvasId);
        this.renderers.push(this.animRenderer = new Grafika.AnimationRenderer(this));
        this.renderers.push(this.frameRenderer = new Grafika.FrameRenderer(this));
        this.renderers.push(this.layerRenderer = new Grafika.LayerRenderer(this));
        this.renderers.push(new Grafika.Renderers.RectangleRenderer(this));
        this.renderers.push(new Grafika.Renderers.SquareRenderer(this));
        this.renderers.push(new Grafika.Renderers.CircleRenderer(this));
        this.renderers.push(new Grafika.Renderers.OvalRenderer(this));
        this.renderers.push(new Grafika.Renderers.FreeformRenderer(this));
        this.renderers.push(new Grafika.Renderers.LineRenderer(this));
        this.renderers.push(new Grafika.Renderers.TriangleRenderer(this));
        this.renderers.push(new Grafika.Renderers.LineRenderer(this));
        this.renderers.push(new Grafika.Renderers.TextRenderer(this));
        this.setAnimation(anim);
        this.setOptions(opts);
        if (Grafika.Plugins) {
            Grafika.Plugins.forEach(function (func) {
                var plugin = func(_this);
                _this.log('Plugin: ' + (plugin.name) + ' v.' + (plugin.version || '{unknown}'));
                _this.plugins.push(plugin);
            });
        }
        this.log('Grafika v.' + this.version + ' [initialized]', this);
        this.callback.on('initialized');
    };
    Grafika.prototype.destroy = function () {
        this.selectedGraphics = [];
        if (this.isPlaying())
            this.pause();
        this.clearCanvas();
        this.clear();
        this.setAnimation(this.animRenderer.create());
        this.refresh();
        this.callback.on('destroyed');
    };
    Grafika.prototype.getAnimation = function () {
        return this.animation;
    };
    Grafika.prototype.setAnimation = function (anim) {
        if (!anim) {
            anim = {};
        }
        else {
            if (!anim.name)
                throw new Error('Animation name is required');
            if (!anim.width || !anim.height)
                throw new Error('Animation width + height is required');
            if (typeof anim.frames === 'undefined' || anim.frames.length == 0) {
                anim.frames = [this.frameRenderer.create()];
            }
        }
        this.animation = this.animRenderer.create(anim);
        this.log('Animation (' + this.animation.localId + ')' +
            ' name: ' + this.animation.name +
            ', timer: ' + this.animation.timer +
            ', size: ' + this.animation.width + ' x ' + this.animation.height +
            ', frames: ' + this.animation.frames.length + ' frames');
        this.canvas.setAttribute('width', "" + this.animation.width);
        this.canvas.setAttribute('height', "" + this.animation.height);
        this.setFrames(this.animation.frames);
    };
    Grafika.prototype.saveAnimation = function (anim) {
        if (anim) {
            var tempFrames = this.animation.frames;
            this.animation = anim;
            this.animation.frames = tempFrames;
        }
        this.animation.totalFrame = this.animation.frames.length;
        this.animation.modified = false;
        this.animation.dateModified = Date.now();
        this.animation.client = {
            navigator: navigator
        };
        this.callback.on('animationSaved');
    };
    Grafika.prototype.play = function () {
        var _this = this;
        if (this.animator)
            return;
        if (!this.animation.timer)
            this.animation.timer = 500;
        this.log('Animation started. Timer: ' + this.animation.timer + 'ms', this.animation);
        this.animator = window.setInterval(function () {
            if (_this.animation.currentFrame >= _this.animation.frames.length - 1) {
                if (_this.options.loop)
                    _this.animation.currentFrame = 0;
                else
                    return _this.pause();
            }
            else {
                _this.navigateTo(_this.animation.currentFrame + 1, false);
            }
        }, this.animation.timer);
        this.callback.on('frameCount', this.animation.frames.length);
        this.callback.on('playing', true);
        this.navigateToFrame(0);
    };
    Grafika.prototype.pause = function () {
        if (typeof this.animator === 'undefined')
            return;
        window.clearInterval(this.animator);
        this.animator = null;
        this.callback.on('playing', false);
        this.log('Animation stopped');
    };
    Grafika.prototype.isPlaying = function () {
        return this.animator != null;
    };
    Grafika.prototype.isModified = function () {
        if (this.animation.modified)
            return true;
        if (this.frame.modified)
            return true;
        return false;
    };
    Grafika.prototype.save = function () {
        this.saveAnimation();
        this.saveFrame();
    };
    Grafika.prototype.getFrame = function () {
        return this.frame;
    };
    Grafika.prototype.getFrames = function () {
        return this.animation.frames;
    };
    Grafika.prototype.setFrames = function (frames) {
        this.animation.frames = frames;
        this.frame = this.animation.frames[0];
        this.navigateToFrame(0);
        this.callback.on('frameCount', this.animation.totalFrame);
    };
    Grafika.prototype.saveFrame = function () {
        this.frame.modified = false;
        this.animation.frames[this.animation.currentFrame] = this.frame;
        this.callback.on('frameSaved', this.animation.currentFrame);
    };
    Grafika.prototype.nextFrame = function () {
        this.navigateToFrame(this.animation.currentFrame + 1);
    };
    Grafika.prototype.previousFrame = function () {
        this.navigateToFrame(this.animation.currentFrame - 1);
    };
    Grafika.prototype.navigateToFrame = function (index) {
        this.navigateTo(index, true);
    };
    Grafika.prototype.findSelectedGraphics = function (x, y) {
        this.selectedGraphics = [];
        for (var i = 0; i < this.frame.layers.length; i++) {
            var layer = this.frame.layers[i];
            for (var j = 0; j < layer.graphics.length; j++) {
                var g = layer.graphics[j];
                if (this.getGraphicRenderer(g).contains(g, x, y)) {
                    this.selectedGraphics.push(g);
                    return this.selectedGraphics;
                }
            }
        }
        return this.selectedGraphics;
    };
    Grafika.prototype.getSelectedGraphics = function () {
        return this.selectedGraphics;
    };
    Grafika.prototype.deleteSelectedGraphics = function () {
        this.frame.modified = true;
        var temp = [];
        var graphics = this.frame.layers[0].graphics;
        for (var i = 0; i < graphics.length; i++) {
            var found = false;
            for (var j = 0; j < this.selectedGraphics.length; j++) {
                if (graphics[i].id == this.selectedGraphics[j].id) {
                    found = true;
                    if (found)
                        break;
                }
            }
            if (!found)
                temp.push(graphics[i]);
        }
        this.frame.layers[0].graphics = temp;
        this.selectedGraphics = [];
        this.refresh();
    };
    Grafika.prototype.getCurrentGraphic = function () {
        return this.currentGraphic;
    };
    Grafika.prototype.getOptions = function () {
        return this.options;
    };
    Grafika.prototype.getCanvas = function () {
        return this.canvas;
    };
    Grafika.prototype.getCanvasContext = function () {
        return this.context;
    };
    Grafika.prototype.setCallback = function (callback) {
        if (!callback)
            throw new Error('callback cannot be undefined');
        this.callback = callback;
    };
    Grafika.prototype.setOptions = function (opts) {
        if (!opts)
            return;
        if (opts.backgroundColor) {
            this.options.backgroundColor = opts.backgroundColor;
            this.frame.backgroundColor = this.options.backgroundColor;
            this.frame.modified = true;
            this.refresh();
        }
        if (opts.foregroundColor) {
            this.options.foregroundColor = opts.foregroundColor;
            this.frame.foregroundColor = this.options.foregroundColor;
            this.refresh();
        }
        if (opts.brushSize)
            this.options.brushSize = opts.brushSize;
        if (opts.graphic) {
            this.options.graphic = opts.graphic;
            this.refresh();
        }
        if (typeof opts.graphicFill !== 'undefined' && opts.graphicFill != null) {
            this.options.graphicFill = opts.graphicFill;
            this.refresh();
        }
        if (typeof opts.useCarbonCopy !== 'undefined' && opts.useCarbonCopy != null) {
            this.options.useCarbonCopy = opts.useCarbonCopy;
            this.refresh();
        }
        if (typeof opts.useNavigationText !== 'undefined' && opts.useNavigationText != null) {
            this.options.useNavigationText = opts.useNavigationText;
            this.refresh();
        }
        if (typeof opts.loop !== 'undefined' && opts.loop != null) {
            this.options.loop = opts.loop;
        }
        if (opts.drawingMode) {
            var mode = opts.drawingMode.toLowerCase();
            if (mode != Grafika.MODE_NONE && mode != Grafika.MODE_PAINT && mode != Grafika.MODE_MOVE && mode != Grafika.MODE_SELECT && mode != Grafika.MODE_DELETE)
                throw new Error('Drawing mode is not supported: ' + mode);
            this.options.drawingMode = mode;
            if (this.options.drawingMode == Grafika.MODE_PAINT || this.options.drawingMode == Grafika.MODE_NONE)
                this.refresh();
            if (this.options.drawingMode == Grafika.MODE_DELETE) {
                this.deleteSelectedGraphics();
                this.refresh();
            }
        }
        if (typeof opts.debugMode !== 'undefined' && opts.debugMode != null) {
            this.options.debugMode = opts.debugMode;
        }
        this.log("Options: ", this.options);
    };
    Grafika.prototype.refresh = function () {
        this.currentGraphic = null;
        return this.setFrame(this.frame, true);
    };
    Grafika.prototype.clear = function () {
        this.frame = this.frameRenderer.create();
        this.refresh();
    };
    Grafika.prototype.getRenderer = function (drawableOrType) {
        for (var i = 0; i < this.renderers.length; i++) {
            if (this.renderers[i].canRender(drawableOrType))
                return this.renderers[i];
        }
        throw new Error("No renderer found for " + drawableOrType);
    };
    Grafika.prototype.getGraphicRenderer = function (graphicOrType) {
        return this.getRenderer(graphicOrType);
    };
    Grafika.prototype.log = function () {
        var optionalParams = [];
        for (var _i = 0; _i < arguments.length; _i++) {
            optionalParams[_i - 0] = arguments[_i];
        }
        if (!this.options.debugMode)
            return;
        if (arguments.length == 0)
            return;
        var params = [];
        for (var i = 1; i < arguments.length; i++) {
            params.push(arguments[i]);
        }
        if (params.length == 0)
            params = '';
        console.log('[grafika] ' + arguments[0], params);
    };
    Grafika.prototype.validateCanvas = function (canvasId) {
        var _this = this;
        if (!canvasId)
            throw new Error('canvasId is required');
        this.canvas = (document.querySelector(canvasId) || document.getElementById(canvasId));
        if (!this.canvas)
            throw new Error('No element found for ' + canvasId + '.');
        this.canvas["isPainting"] = false;
        this.canvas.addEventListener('mousedown', function (e) { return _this.onMouseDown(e); });
        this.canvas.addEventListener('touchstart', function (e) { return _this.onMouseDown(e); });
        this.canvas.addEventListener('mousemove', function (e) { return _this.onMouseMove(e); });
        this.canvas.addEventListener('touchmove', function (e) { return _this.onMouseMove(e); });
        this.canvas.addEventListener('mouseup', function (e) { return _this.onMouseUp(e); });
        this.canvas.addEventListener('touchend', function (e) { return _this.onMouseUp(e); });
        this.canvas.addEventListener('mouseleave', function (e) { return _this.onMouseUp(e); });
        this.canvas.addEventListener('touchleave', function (e) { return _this.onMouseUp(e); });
        this.context = this.canvas.getContext('2d');
        if (!this.context.setLineDash) {
            this.log('LineDash: is not available!');
            this.context.setLineDash = function () { };
        }
        return this.canvas;
    };
    Grafika.prototype.navigateTo = function (idx, save) {
        if (idx <= 0)
            idx = 0;
        if (save)
            this.saveFrame();
        this.animation.currentFrame = idx;
        this.frame = this.animation.frames[this.animation.currentFrame];
        if (!this.frame) {
            this.frame = this.frameRenderer.create();
        }
        if (save)
            this.saveFrame();
        this.setFrame(this.frame, true);
        this.callback.on('frameChanged', this.frame.index);
        this.log('Current Frame: ' + (this.animation.currentFrame + 1) + '/' + this.animation.frames.length, this.frame);
    };
    Grafika.prototype.setFrame = function (fr, clear) {
        var _this = this;
        if (!fr)
            return;
        if (clear || !fr || fr.id != this.frame.id) {
            this.clearCanvas();
            this.selectedGraphics = [];
            this.frame = fr;
        }
        this.context.rect(-2, -2, parseInt(this.canvas.getAttribute('width')) + 2, parseInt(this.canvas.getAttribute('height')) + 2);
        this.context.fillStyle = this.frame.backgroundColor;
        this.context.fill();
        if (this.options.useNavigationText) {
            this.context.fillStyle = 'gray';
            this.context.font = '25px verdana';
            this.context["fontWeight"] = 'bold';
            this.context.fillText((this.animation.currentFrame + 1) + ' / ' + (this.animation.frames.length), 15, 40);
        }
        if (this.frame.backgroundResourceId) {
            var img = new Image();
            img.onload = function () {
                _this.context.drawImage(img, 0, 0, parseInt(_this.canvas.getAttribute('width')), parseInt(_this.canvas.getAttribute('height')));
                _this.frameRenderer.draw(_this.frame);
            };
            img.onerror = function (e) {
                _this.frameRenderer.draw(_this.frame);
            };
            img.crossOrigin = "use-credentials";
            if (!img.src) {
            }
        }
        else {
            this.frameRenderer.draw(this.frame);
        }
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
        var eX = e.offsetX;
        var eY = e.offsetY;
        if (e.changedTouches) {
            eX = e.changedTouches[0].pageX;
            eY = e.changedTouches[0].pageY;
        }
        if (this.options.drawingMode == Grafika.MODE_MOVE && this.selectedGraphics.length > 0) {
            this.isMovingGraphics = true;
            return;
        }
        if (this.options.drawingMode == Grafika.MODE_SELECT) {
            var newSelectedGraphics = this.findSelectedGraphics(eX, eY);
            if (newSelectedGraphics.length > 0) {
                this.selectedGraphics = [];
                this.redraw();
                this.selectedGraphics = newSelectedGraphics;
                this.redraw();
                return;
            }
            else {
                this.selectedGraphics = [];
                this.redraw();
            }
        }
        if (this.options.drawingMode != Grafika.MODE_PAINT)
            return;
        var renderer = this.getGraphicRenderer(this.options.graphic);
        this.canvas["isPainting"] = this.options.drawingMode == Grafika.MODE_PAINT;
        this.currentGraphic = renderer.create();
        this.currentGraphic.isFilled = this.options.graphicFill;
        this.currentGraphic.x = eX;
        this.currentGraphic.y = eY;
        this.currentGraphic.brushSize = this.options.brushSize;
        this.currentGraphic.backgroundColor = this.options.backgroundColor;
        this.currentGraphic.foregroundColor = this.options.foregroundColor;
        renderer.invoke(this.currentGraphic, "mousedown", eX, eY);
    };
    Grafika.prototype.onMouseMove = function (e) {
        if (!e || this.isPlaying())
            return;
        var eX = e.offsetX;
        var eY = e.offsetY;
        if (!eX || !eY) {
            if (e.changedTouches) {
                eX = e.changedTouches[0].pageX;
                eY = e.changedTouches[0].pageY;
            }
            else
                return;
        }
        if (this.isMovingGraphics && this.selectedGraphics.length > 0) {
            if (!this.lastX)
                this.lastX = eX;
            if (!this.lastY)
                this.lastY = eY;
            for (var i = 0; i < this.selectedGraphics.length; i++) {
                this.getGraphicRenderer(this.selectedGraphics[i]).move(this.selectedGraphics[i], eX, eY, this.lastX, this.lastY);
            }
            this.lastX = eX;
            this.lastY = eY;
            this.clearCanvas();
            this.redraw();
            return;
        }
        if (this.canvas["isPainting"] && this.currentGraphic) {
            this.getGraphicRenderer(this.currentGraphic).invoke(this.currentGraphic, 'mousemove', eX, eY);
            this.redraw();
        }
    };
    Grafika.prototype.onMouseUp = function (e) {
        if (!e || this.isPlaying())
            return;
        var eX = e.offsetX;
        var eY = e.offsetY;
        if (!eX || !eY) {
            if (e.changedTouches) {
                eX = e.changedTouches[0].pageX;
                eY = e.changedTouches[0].pageY;
            }
            else
                return;
        }
        if (this.isPlaying() && e.type == 'mouseup') {
            this.pause();
            return;
        }
        if (this.isMovingGraphics) {
            this.isMovingGraphics = false;
            this.callback.on('frameUpdated', this.frame.index);
            this.lastX = null;
            this.lastY = null;
            this.clearCanvas();
            this.redraw();
            return;
        }
        if (!this.canvas["isPainting"])
            return;
        var renderer = this.getGraphicRenderer(this.currentGraphic);
        renderer.invoke(this.currentGraphic, 'mouseup', eX, eY);
        if (this.currentGraphic && renderer.isValid(this.currentGraphic)) {
            this.frame.layers[0].graphics.push(this.currentGraphic);
            this.frame.modified = true;
            this.callback.on('frameUpdated', this.frame.index);
        }
        this.refresh();
        this.canvas["isPainting"] = false;
    };
    Grafika.prototype.clearCanvas = function () {
        this.context.clearRect(0, 0, this.context.canvas.width, this.context.canvas.height);
        this.context.rect(-2, -2, parseInt(this.canvas.getAttribute('width')) + 2, parseInt(this.canvas.getAttribute('height')) + 2);
        this.context.fillStyle = '#ffffff';
        this.context.fill();
    };
    Grafika.prototype.redraw = function () {
        return this.setFrame(this.frame);
    };
    Grafika.randomUid = function () {
        return (("000000" + (Math.random() * Math.pow(36, 6) << 0).toString(36)).slice(-6));
    };
    Grafika.hexToRgb = function (hex) {
        var shorthandRegex = /^#?([a-f\d])([a-f\d])([a-f\d])$/i;
        hex = hex.replace(shorthandRegex, function (m, r, g, b) {
            return r + r + g + g + b + b;
        });
        var result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);
        return result ? { r: parseInt(result[1], 16), g: parseInt(result[2], 16), b: parseInt(result[3], 16) } : { r: 0, g: 0, b: 0 };
    };
    return Grafika;
}());
var Grafika;
(function (Grafika) {
    Grafika.Plugins = [];
    Grafika.VERSION = '0.12.2';
    Grafika.MODE_NONE = 'none', Grafika.MODE_PAINT = 'paint', Grafika.MODE_MOVE = 'move', Grafika.MODE_SELECT = 'select', Grafika.MODE_DELETE = 'delete';
    (function (DrawingMode) {
        DrawingMode[DrawingMode["None"] = 0] = "None";
        DrawingMode[DrawingMode["Paint"] = 1] = "Paint";
        DrawingMode[DrawingMode["Move"] = 2] = "Move";
        DrawingMode[DrawingMode["Select"] = 3] = "Select";
        DrawingMode[DrawingMode["Delete"] = 4] = "Delete";
    })(Grafika.DrawingMode || (Grafika.DrawingMode = {}));
    var DrawingMode = Grafika.DrawingMode;
    (function (Events) {
        Events[Events["Initialized"] = 0] = "Initialized";
        Events[Events["FrameChanged"] = 1] = "FrameChanged";
        Events[Events["FrameUpdated"] = 2] = "FrameUpdated";
        Events[Events["Destroyed"] = 3] = "Destroyed";
    })(Grafika.Events || (Grafika.Events = {}));
    var Events = Grafika.Events;
    var Animation = (function () {
        function Animation() {
        }
        return Animation;
    }());
    Grafika.Animation = Animation;
    var Renderer = (function () {
        function Renderer(grafika) {
            this.grafika = grafika;
            this.canvas = grafika.getCanvas();
            this.context = grafika.getCanvasContext();
        }
        Renderer.prototype.canRender = function (drawable) {
            return (drawable && drawable.type === this.getRenderingType() || drawable === this.getRenderingType());
        };
        return Renderer;
    }());
    Grafika.Renderer = Renderer;
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
            anim.frames = anim.frames || [this.grafika.getRenderer('frame').create()];
            anim.totalFrame = anim.totalFrame || 0;
            anim.currentFrame = anim.currentFrame || 0;
            anim.modified = anim.modified || false;
            return anim;
        };
        AnimationRenderer.prototype.draw = function (animation) {
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
        function FrameRenderer() {
            _super.apply(this, arguments);
        }
        FrameRenderer.prototype.create = function (frame) {
            if (!frame) {
                frame = { type: "frame" };
            }
            frame.id = frame.id || Grafika.randomUid();
            frame.index = (frame.index >= 0 ? frame.index : (this.grafika.getAnimation().currentFrame || 0));
            frame.modified = frame.modified || false;
            frame.backgroundResourceId = frame.backgroundResourceId || undefined;
            frame.backgroundColor = frame.backgroundColor || this.grafika.getOptions().backgroundColor;
            frame.foregroundColor = frame.foregroundColor || this.grafika.getOptions().foregroundColor;
            frame.layers = frame.layers || [this.grafika.getRenderer('layer').create()];
            frame.type = "frame";
            return frame;
        };
        FrameRenderer.prototype.draw = function (frame, opts) {
            var selectedGraphics = this.grafika.getSelectedGraphics();
            var animation = this.grafika.getAnimation();
            var options = this.grafika.getOptions();
            var currentGraphic = this.grafika.getCurrentGraphic();
            var layerRenderer = this.grafika.getRenderer("layer");
            for (var i = 0; i < selectedGraphics.length; i++) {
                var g = selectedGraphics[i];
                var renderer = this.grafika.getGraphicRenderer(g);
                var rect = renderer.getBounds(g);
                var offset = g.brushSize / 2;
                this.context.lineWidth = 2;
                this.context.setLineDash([2, 4]);
                if (frame.backgroundColor != '#000000')
                    this.context.strokeStyle = 'rgba(0, 0, 0, 0.5)';
                else
                    this.context.strokeStyle = 'rgba(255, 255, 255, 0.6)';
                this.context.strokeRect(rect.x - offset - 2, rect.y - offset - 2, rect.width + (offset * 2) + 4, rect.height + (offset * 2) + 4);
            }
            if (options.useCarbonCopy && animation.currentFrame > 0) {
                var previousFrame = animation.frames[animation.currentFrame - 1];
                if (previousFrame) {
                    for (var li = 0; li < previousFrame.layers.length; li++) {
                        layerRenderer.draw(previousFrame.layers[li], { useCarbonCopy: true });
                    }
                }
            }
            for (var i = 0; i < frame.layers.length; i++) {
                layerRenderer.draw(frame.layers[i]);
            }
            if (currentGraphic) {
                var renderer = this.grafika.getGraphicRenderer(currentGraphic);
                renderer.draw(currentGraphic);
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
        LayerRenderer.prototype.draw = function (layer, opts) {
            var g;
            this.context.setLineDash([]);
            this.context.lineJoin = "round";
            this.context.lineCap = "round";
            for (var i = 0; i < layer.graphics.length; i++) {
                g = layer.graphics[i];
                if (opts && opts.useCarbonCopy) {
                    var rgb = Grafika.hexToRgb(g.foregroundColor);
                    g.foregroundAlpha = 'rgba(' + rgb.r + ',' + rgb.g + ',' + rgb.b + ', 0.2)';
                }
                this.grafika.getGraphicRenderer(g).draw(g);
                delete g.foregroundAlpha;
            }
        };
        LayerRenderer.prototype.getRenderingType = function () {
            return "layer";
        };
        return LayerRenderer;
    }(Renderer));
    Grafika.LayerRenderer = LayerRenderer;
    var Renderers;
    (function (Renderers) {
        var GraphicRenderer = (function (_super) {
            __extends(GraphicRenderer, _super);
            function GraphicRenderer(grafika) {
                _super.call(this, grafika);
            }
            GraphicRenderer.prototype.create = function (graphic) {
                if (!graphic)
                    graphic = { type: this.getRenderingType() };
                graphic.id = graphic.id || (("0000" + (Math.random() * Math.pow(36, 4) << 0).toString(36)).slice(-4));
                graphic.x = graphic.x || 0;
                graphic.y = graphic.y || 0;
                graphic.width = graphic.width || 10;
                graphic.height = graphic.height || 10;
                graphic.backgroundColor = graphic.backgroundColor || "#ffffff";
                graphic.foregroundColor = graphic.foregroundColor || "#000000";
                graphic.foregroundAlpha = graphic.foregroundAlpha || undefined;
                graphic.isFilled = (typeof graphic.isFilled !== 'undefined' && graphic.isFilled != null) ? graphic.isFilled : false;
                graphic.isVisible = (typeof graphic.isVisible !== 'undefined' && graphic.isVisible != null) ? graphic.isVisible : true;
                graphic.brushSize = graphic.brushSize || 2;
                graphic.type = graphic.type || undefined;
                return graphic;
            };
            GraphicRenderer.prototype.draw = function (graphic) {
                this.context.lineWidth = graphic.brushSize > 1 ? graphic.brushSize : 1;
                this.context.strokeStyle = graphic.foregroundAlpha || graphic.foregroundColor;
                this.context.fillStyle = graphic.foregroundAlpha || graphic.foregroundColor;
                this.onDraw(graphic);
            };
            GraphicRenderer.prototype.move = function (graphic, x, y, lastX, lastY) {
                this.onMove(graphic, x, y, lastX, lastY);
            };
            GraphicRenderer.prototype.invoke = function (graphic, eventType, eventX, eventY) {
                this.onEvent(graphic, eventType, eventX, eventY);
            };
            return GraphicRenderer;
        }(Renderer));
        Renderers.GraphicRenderer = GraphicRenderer;
        var ShapeRenderer = (function (_super) {
            __extends(ShapeRenderer, _super);
            function ShapeRenderer() {
                _super.apply(this, arguments);
            }
            ShapeRenderer.prototype.getBounds = function (graphic) {
                return {
                    x: graphic.width > 0 ? graphic.x : graphic.x + graphic.width,
                    y: graphic.height > 0 ? graphic.y : graphic.y + graphic.height,
                    width: Math.abs(graphic.width),
                    height: Math.abs(graphic.height)
                };
            };
            ShapeRenderer.prototype.contains = function (graphic, x, y) {
                var bounds = this.getBounds(graphic);
                return bounds.x < x && bounds.x + bounds.width > x && bounds.y < y && bounds.y + bounds.height > y;
            };
            ShapeRenderer.prototype.isValid = function (graphic) {
                return Math.abs(graphic.width) > 20 && Math.abs(graphic.height) > 20;
            };
            return ShapeRenderer;
        }(GraphicRenderer));
        Renderers.ShapeRenderer = ShapeRenderer;
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
            FreeformRenderer.prototype.getBounds = function (graphic) {
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
            FreeformRenderer.prototype.isValid = function (graphic) {
                var rect = this.getBounds(graphic);
                return rect.width > 5 || rect.height > 5;
            };
            FreeformRenderer.prototype.onDraw = function (graphic) {
                this.context.beginPath();
                this.context.moveTo(graphic.x, graphic.y);
                for (var i = 0; i < graphic.points.length; i++) {
                    var point = graphic.points[i];
                    this.context.lineTo(point.x, point.y);
                }
                if (graphic.isFilled)
                    this.context.fill();
                else
                    this.context.stroke();
            };
            FreeformRenderer.prototype.onMove = function (graphic, x, y, lastX, lastY) {
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
            FreeformRenderer.prototype.onEvent = function (graphic, eventType, eventX, eventY) {
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
        }(ShapeRenderer));
        Renderers.FreeformRenderer = FreeformRenderer;
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
            LineRenderer.prototype.onDraw = function (graphic) {
                this.context.moveTo(graphic.x, graphic.y);
                this.context.lineTo(graphic.endX, graphic.endY);
                this.context.stroke();
            };
            LineRenderer.prototype.onMove = function (graphic, x, y, lastX, lastY) {
                graphic.x = graphic.x + (x - lastX);
                graphic.y = graphic.y + (y - lastY);
                graphic.endX = graphic.endX + (x - lastX);
                graphic.endY = graphic.endY + (y - lastY);
            };
            LineRenderer.prototype.onEvent = function (graphic, eventType, eventX, eventY) {
                switch (eventType) {
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
        }(ShapeRenderer));
        Renderers.LineRenderer = LineRenderer;
        var RectangleRenderer = (function (_super) {
            __extends(RectangleRenderer, _super);
            function RectangleRenderer() {
                _super.apply(this, arguments);
            }
            RectangleRenderer.prototype.onDraw = function (graphic) {
                if (graphic.isFilled)
                    this.context.fillRect(graphic.x, graphic.y, graphic.width, graphic.height);
                else {
                    this.context.strokeRect(graphic.x, graphic.y, graphic.width, graphic.height);
                }
            };
            RectangleRenderer.prototype.onMove = function (graphic, x, y, lastX, lastY) {
                graphic.x = graphic.x + (x - lastX);
                graphic.y = graphic.y + (y - lastY);
            };
            RectangleRenderer.prototype.onEvent = function (graphic, eventType, eventX, eventY) {
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
        }(ShapeRenderer));
        Renderers.RectangleRenderer = RectangleRenderer;
        var SquareRenderer = (function (_super) {
            __extends(SquareRenderer, _super);
            function SquareRenderer() {
                _super.apply(this, arguments);
            }
            SquareRenderer.prototype.onEvent = function (graphic, eventType, eventX, eventY) {
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
        Renderers.SquareRenderer = SquareRenderer;
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
            CircleRenderer.prototype.onDraw = function (graphic) {
                this.context.beginPath();
                this.context.arc(graphic.x, graphic.y, graphic.radius, 0, 2 * Math.PI);
                if (graphic.isFilled)
                    this.context.fill();
                else
                    this.context.stroke();
            };
            CircleRenderer.prototype.onEvent = function (graphic, eventType, eventX, eventY) {
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
        Renderers.CircleRenderer = CircleRenderer;
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
            OvalRenderer.prototype.onDraw = function (graphic) {
                this.context.beginPath();
                this.context.ellipse(graphic.x, graphic.y, graphic.radius, graphic.radiusY, 0, 0, 2 * Math.PI);
                if (graphic.isFilled)
                    this.context.fill();
                else
                    this.context.stroke();
            };
            OvalRenderer.prototype.onEvent = function (graphic, eventType, eventX, eventY) {
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
        Renderers.OvalRenderer = OvalRenderer;
        var TriangleRenderer = (function (_super) {
            __extends(TriangleRenderer, _super);
            function TriangleRenderer() {
                _super.apply(this, arguments);
            }
            TriangleRenderer.prototype.onDraw = function (graphic) {
                this.context.beginPath();
                this.context.moveTo(graphic.x + (graphic.width / 2), graphic.y);
                this.context.lineTo(graphic.x, graphic.y + graphic.height);
                this.context.lineTo(graphic.x + graphic.width, graphic.y + graphic.height);
                this.context.closePath();
                if (graphic.isFilled)
                    this.context.fill();
                else
                    this.context.stroke();
            };
            TriangleRenderer.prototype.getRenderingType = function () {
                return "triangle";
            };
            return TriangleRenderer;
        }(RectangleRenderer));
        Renderers.TriangleRenderer = TriangleRenderer;
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
            TextRenderer.prototype.onDraw = function (graphic) {
                this.context.font = graphic.height + 'px ' + graphic.font;
                if (graphic.isFilled) {
                    this.context.fillStyle = graphic.foregroundAlpha || graphic.foregroundColor;
                    this.context.fillText(graphic.text, graphic.x, graphic.y + graphic.height);
                }
                else {
                    this.context.strokeStyle = graphic.foregroundAlpha || graphic.foregroundColor;
                    this.context.strokeText(graphic.text, graphic.x, graphic.y + graphic.height);
                }
            };
            TextRenderer.prototype.onEvent = function (graphic, eventType, eventX, eventY) {
                switch (eventType) {
                    case "mouseup":
                        graphic.text = this.prompt('Insert text');
                        this.drawFocusRectangle(graphic);
                        this.draw(graphic);
                        break;
                }
            };
            TextRenderer.prototype.drawFocusRectangle = function (graphic) {
                var rect = this.context.measureText(graphic.text);
                graphic.width = rect.width;
                this.context.lineWidth = 1;
                this.context.setLineDash([2, 4]);
                this.context.strokeStyle = graphic.foregroundColor;
                this.context.rect(graphic.x, graphic.y, graphic.width, graphic.height);
            };
            TextRenderer.prototype.prompt = function (text, title) {
                return window.prompt(text, title);
            };
            TextRenderer.prototype.getRenderingType = function () {
                return "text";
            };
            return TextRenderer;
        }(RectangleRenderer));
        Renderers.TextRenderer = TextRenderer;
    })(Renderers = Grafika.Renderers || (Grafika.Renderers = {}));
})(Grafika || (Grafika = {}));
//# sourceMappingURL=grafika.js.map