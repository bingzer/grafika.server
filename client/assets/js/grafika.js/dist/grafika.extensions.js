Grafika.Plugins.push(function (grafika) {
    var GrafikaExtensions = (function () {
        function GrafikaExtensions(grafika) {
            this.grafika = grafika;
            this.name = 'Extensions';
            this.version = '1.0.0';
            this.imageQuality = 100;
        }
        GrafikaExtensions.prototype.copyFrameToNext = function () {
            this.grafika.saveFrame();
            var nextIndex = this.grafika.getAnimation().currentFrame + 1;
            var cloned = JSON.parse(JSON.stringify(this.grafika.getFrame(), this.getJSONReplacer()));
            cloned.index = nextIndex;
            cloned.id = this.randomUid();
            var frameRenderer = this.grafika.getRenderer('frame');
            this.grafika.getAnimation().frames[nextIndex] = frameRenderer.create(cloned);
            this.grafika.navigateToFrame(nextIndex);
            this.log('Frame copied to next frame');
        };
        GrafikaExtensions.prototype.downloadAnimation = function () {
            grafika.saveFrame();
            window.open("data:text/json;charset=utf-8," + JSON.stringify(grafika.getAnimation(), this.getJSONReplacer()));
        };
        GrafikaExtensions.prototype.downloadFrameAsImage = function () {
            grafika.saveFrame();
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
            grafika.saveFrame();
            var options = {
                useNavigationText: grafika.getOptions().useNavigationText,
                useCarbonCopy: grafika.getOptions().useCarbonCopy,
                drawingMode: grafika.getOptions().drawingMode
            };
            grafika.setOptions({ useNavigationText: false, useCarbonCopy: false, drawingMode: 'none' });
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