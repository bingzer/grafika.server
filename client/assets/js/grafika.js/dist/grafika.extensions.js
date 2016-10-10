Grafika.Plugins.push(function (grafika) {
    var GrafikaExtensions = (function () {
        function GrafikaExtensions(grafika) {
            this.grafika = grafika;
            this.name = 'Extensions';
            this.version = '1.0.0';
            this.imageQuality = 100;
            this.frameRenderer = this.grafika.getRenderer('frame');
        }
        GrafikaExtensions.prototype.clearFrame = function () {
            this.grafika.clear();
            this.grafika.saveFrame();
        };
        GrafikaExtensions.prototype.deleteFrame = function () {
            var animation = this.grafika.animation;
            var currentIndex = animation.currentFrame;
            if (currentIndex < 0)
                return;
            animation.frames.splice(currentIndex, 1);
            if (animation.frames.length == 0) {
                animation.frames.push(this.frameRenderer.create());
            }
            if (currentIndex > animation.frames.length - 1)
                currentIndex = animation.frames.length - 1;
            animation.currentFrame = currentIndex;
            this.grafika.frame = animation.frames[animation.currentFrame];
            this.grafika.navigateToFrame(animation.currentFrame);
        };
        GrafikaExtensions.prototype.copyFrameToNext = function () {
            this.grafika.saveFrame();
            var nextIndex = this.grafika.getAnimation().currentFrame + 1;
            var cloned = JSON.parse(JSON.stringify(this.grafika.getFrame(), this.getJSONReplacer()));
            cloned.index = nextIndex;
            cloned.id = this.randomUid();
            this.grafika.getAnimation().frames[nextIndex] = this.frameRenderer.create(cloned);
            this.grafika.navigateToFrame(nextIndex);
            this.log('Frame copied to next frame');
            this.grafika.saveFrame();
        };
        GrafikaExtensions.prototype.copyFrameToPrevious = function () {
            this.grafika.saveFrame();
            var previousIndex = this.grafika.getAnimation().currentFrame - 1;
            if (previousIndex < 0)
                return;
            var cloned = JSON.parse(JSON.stringify(this.grafika.getFrame(), this.getJSONReplacer()));
            cloned.index = previousIndex;
            cloned.id = this.randomUid();
            this.grafika.getAnimation().frames[previousIndex] = this.frameRenderer.create(cloned);
            this.grafika.navigateToFrame(previousIndex);
            this.log('Frame copied to previous frame');
            this.grafika.saveFrame();
        };
        GrafikaExtensions.prototype.insertFrameAfter = function () {
            this.grafika.saveFrame();
            var index = this.grafika.animation.currentFrame;
            var newFrame = this.frameRenderer.create({ index: index + 1 });
            var currFrame = this.grafika.frame;
            this.grafika.animation.frames.splice(index, 0, newFrame);
            this.grafika.animation.frames[index] = currFrame;
            this.grafika.animation.frames[newFrame.index] = newFrame;
            this.grafika.animation.currentFrame = newFrame.index;
            this.grafika.frame = this.grafika.animation.frames[newFrame.index];
            this.grafika.saveFrame();
            this.grafika.navigateToFrame(this.grafika.animation.currentFrame);
            this.log('Frame inserted after current frame');
        };
        GrafikaExtensions.prototype.insertFrameBefore = function () {
            this.grafika.saveFrame();
            var index = this.grafika.animation.currentFrame;
            if (index < 0)
                return;
            var newFrame = this.frameRenderer.create({ index: index });
            this.grafika.animation.frames.splice(index, 0, newFrame);
            this.grafika.frame = this.grafika.animation.frames[index];
            this.grafika.saveFrame();
            this.grafika.navigateToFrame(this.grafika.animation.currentFrame);
            this.log('Frame inserted before current frame');
        };
        GrafikaExtensions.prototype.deleteSelectedGraphics = function () {
            this.grafika.deleteSelectedGraphics();
            this.grafika.saveFrame();
            this.log('Selected graphics deleted');
        };
        GrafikaExtensions.prototype.downloadAnimation = function () {
            this.grafika.saveFrame();
            window.open("data:text/json;charset=utf-8," + JSON.stringify(this.grafika.getAnimation(), this.getJSONReplacer()));
        };
        GrafikaExtensions.prototype.downloadFrameAsImage = function () {
            this.grafika.saveFrame();
            window.open("data:image/png;base64," + this.getCanvasData().base64);
        };
        GrafikaExtensions.prototype.getCanvasBlob = function () {
            var oldOptions = this.captureOldOptions();
            var binary = atob(grafika.getCanvas().toDataURL("image/png", this.imageQuality).split(',')[1]);
            var array = [];
            for (var i = 0; i < binary.length; i++) {
                array.push(binary.charCodeAt(i));
            }
            grafika.setOptions(oldOptions);
            return new Blob([new Uint8Array(array)], { type: 'image/png' });
        };
        GrafikaExtensions.prototype.getCanvasData = function () {
            var oldOptions = this.captureOldOptions();
            var rawData = grafika.getCanvas().toDataURL("image/png", this.imageQuality);
            var mime = rawData.substring(rawData.indexOf("data:") + "data:".length, rawData.indexOf(";"));
            grafika.setOptions(oldOptions);
            return {
                mime: mime,
                base64: rawData.substring(rawData.indexOf(",") + ",".length)
            };
        };
        GrafikaExtensions.prototype.randomUid = function () {
            return (("000000" + (Math.random() * Math.pow(36, 6) << 0).toString(36)).slice(-6));
        };
        GrafikaExtensions.prototype.log = function (msg) {
            console.log('[GrafikaExt] ' + msg);
        };
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