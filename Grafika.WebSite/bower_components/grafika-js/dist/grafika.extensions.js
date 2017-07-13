Grafika.Plugins.push(function (grafika) {
    var GrafikaExtensions = (function () {
        function GrafikaExtensions(grafika) {
            var _this = this;
            this.grafika = grafika;
            this.name = 'Extensions';
            this.version = '1.0.0';
            this.imageQuality = 100;
            this.getName = function () { return ("[" + _this.name + " " + _this.version + "]"); };
            this.isLogEnabled = function () { return _this.grafika.getOptions().debugMode; };
            this.clearFrame = function () {
                _this.grafika.clearFrame();
                _this.grafika.saveFrame();
            };
            this.deleteFrame = function () {
                var animation = _this.grafika.animation;
                var currentIndex = animation.currentFrame;
                if (currentIndex < 0)
                    return;
                _this.grafika.frames.splice(currentIndex, 1);
                if (_this.grafika.frames.length == 0) {
                    _this.grafika.frames.push(_this.frameRenderer.create());
                }
                if (currentIndex > _this.grafika.frames.length - 1)
                    currentIndex = _this.grafika.frames.length - 1;
                animation.currentFrame = currentIndex;
                _this.grafika.frame = _this.grafika.frames[animation.currentFrame];
                _this.grafika.navigateToFrame(animation.currentFrame);
            };
            this.copyFrameToNext = function () {
                _this.grafika.saveFrame();
                var nextIndex = _this.grafika.getAnimation().currentFrame + 1;
                var cloned = JSON.parse(JSON.stringify(_this.grafika.getFrame(), _this.getJSONReplacer()));
                cloned.index = nextIndex;
                cloned.id = Grafika.randomUid();
                _this.grafika.frames[nextIndex] = _this.frameRenderer.create(cloned);
                _this.grafika.navigateToFrame(nextIndex);
                _this.grafika.saveFrame();
                Grafika.log(_this, 'Frame copied to next frame');
            };
            this.copyFrameToPrevious = function () {
                _this.grafika.saveFrame();
                var previousIndex = _this.grafika.getAnimation().currentFrame - 1;
                if (previousIndex < 0)
                    return;
                var cloned = JSON.parse(JSON.stringify(_this.grafika.getFrame(), _this.getJSONReplacer()));
                cloned.index = previousIndex;
                cloned.id = Grafika.randomUid();
                _this.grafika.frames[previousIndex] = _this.frameRenderer.create(cloned);
                _this.grafika.navigateToFrame(previousIndex);
                _this.grafika.saveFrame();
                Grafika.log(_this, 'Frame copied to previous frame');
            };
            this.insertFrameAfter = function () {
                _this.grafika.saveFrame();
                var index = _this.grafika.animation.currentFrame;
                var newFrame = _this.frameRenderer.create({ index: index + 1 });
                var currFrame = _this.grafika.frame;
                _this.grafika.frames.splice(index, 0, newFrame);
                _this.grafika.frames[index] = currFrame;
                _this.grafika.frames[newFrame.index] = newFrame;
                _this.grafika.animation.currentFrame = newFrame.index;
                _this.grafika.frame = _this.grafika.frames[newFrame.index];
                _this.grafika.saveFrame();
                _this.grafika.navigateToFrame(_this.grafika.animation.currentFrame);
                Grafika.log(_this, 'Frame inserted after current frame');
            };
            this.insertFrameBefore = function () {
                _this.grafika.saveFrame();
                var index = _this.grafika.animation.currentFrame;
                if (index < 0)
                    return;
                var newFrame = _this.frameRenderer.create({ index: index });
                _this.grafika.frames.splice(index, 0, newFrame);
                _this.grafika.frame = _this.grafika.frames[index];
                _this.grafika.saveFrame();
                _this.grafika.navigateToFrame(_this.grafika.animation.currentFrame);
                Grafika.log(_this, 'Frame inserted before current frame');
            };
            this.getFrameProperty = function (propertyName) { return _this.grafika.frame[propertyName]; };
            this.deleteSelectedGraphics = function () {
                _this.grafika.deleteSelectedGraphics();
                _this.grafika.saveFrame();
                Grafika.log(_this, 'Selected graphics deleted');
            };
            this.copySelectedGraphics = function () {
                _this.grafika.copySelectedGraphics();
                Grafika.log(_this, 'Selected graphics copied');
            };
            this.pasteSelectedGraphics = function () {
                _this.grafika.pasteSelectedGraphics();
                _this.grafika.saveFrame();
                Grafika.log(_this, 'Selected graphics pasted');
            };
            this.downloadAnimation = function () {
                _this.grafika.saveFrame();
                window.open("data:application/json;charset=utf-8," + JSON.stringify(_this.grafika.getAnimation(), _this.getJSONReplacer()));
            };
            this.downloadFrameAsImage = function () {
                _this.grafika.saveFrame();
                _this.getCanvasData(function (err, data) {
                    if (err)
                        console.error(err);
                    else
                        window.open("data:image/png;base64," + data.base64);
                });
            };
            this.getCanvasBlob = function (callback) {
                var error = undefined;
                var canvasBlob = undefined;
                var oldOptions = _this.captureOldOptions();
                var frameRenderer = _this.grafika.getRenderer("frame");
                frameRenderer.drawBackground(_this.grafika.contextBackground, _this.grafika.getFrame(), function (err, resource) {
                    frameRenderer.draw(_this.grafika.contextBackground, _this.grafika.getFrame());
                    error = err;
                    try {
                        var binary = atob(_this.grafika.contextBackground.canvas.toDataURL("image/png", _this.imageQuality).split(',')[1]);
                        var array = [];
                        for (var i = 0; i < binary.length; i++) {
                            array.push(binary.charCodeAt(i));
                        }
                        _this.grafika.setOptions(oldOptions);
                        canvasBlob = { mime: "image/png", blob: new Blob([new Uint8Array(array)]) };
                    }
                    catch (e) {
                        error = e;
                    }
                    if (callback)
                        callback(error, canvasBlob);
                });
                if (!callback) {
                    var wait_1 = setInterval(function () {
                        if (Grafika.isDefined(error) || Grafika.isDefined(canvasBlob)) {
                            clearInterval(wait_1);
                        }
                    }, 100);
                }
                return canvasBlob;
            };
            this.getCanvasData = function (callback) {
                var error = undefined;
                var canvasData = undefined;
                var oldOptions = _this.captureOldOptions();
                var frameRenderer = _this.grafika.getRenderer("frame");
                frameRenderer.drawBackground(_this.grafika.contextBackground, _this.grafika.getFrame(), function (err, resource) {
                    frameRenderer.draw(_this.grafika.contextBackground, _this.grafika.getFrame());
                    error = err;
                    try {
                        var rawData = _this.grafika.contextBackground.canvas.toDataURL("image/png", _this.imageQuality);
                        var mime = rawData.substring(rawData.indexOf("data:") + "data:".length, rawData.indexOf(";"));
                        _this.grafika.setOptions(oldOptions);
                        _this.grafika.refreshFrame({ drawBackground: true });
                        canvasData = { mime: mime, base64: rawData.substring(rawData.indexOf(",") + ",".length) };
                    }
                    catch (e) {
                        error = e;
                    }
                    if (callback)
                        callback(error, canvasData);
                });
                if (!callback) {
                    var wait_2 = setInterval(function () {
                        if (Grafika.isDefined(error) || Grafika.isDefined(canvasData)) {
                            clearInterval(wait_2);
                        }
                    }, 100);
                }
                return canvasData;
            };
            this.frameRenderer = this.grafika.getRenderer('frame');
        }
        GrafikaExtensions.prototype.captureOldOptions = function () {
            this.grafika.saveFrame();
            var options = {
                useNavigationText: this.grafika.getOptions().useNavigationText,
                useCarbonCopy: this.grafika.getOptions().useCarbonCopy,
                drawingMode: this.grafika.getOptions().drawingMode
            };
            this.grafika.setOptions({ useNavigationText: false, useCarbonCopy: false, drawingMode: 'none' });
            return options;
        };
        GrafikaExtensions.prototype.getJSONReplacer = function () {
            return function (key, value) {
                if (key === 'grafika')
                    return undefined;
                else
                    return value;
            };
        };
        return GrafikaExtensions;
    }());
    return grafika.exts = new GrafikaExtensions(grafika);
});
//# sourceMappingURL=grafika.extensions.js.map