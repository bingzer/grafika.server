Grafika.Plugins.push(function (grafika) {
    var GrafikaRandomDrawing = (function () {
        function GrafikaRandomDrawing(grafika) {
            this.grafika = grafika;
            this.name = 'Random Drawing Test';
            this.version = '1.0.0';
        }
        GrafikaRandomDrawing.prototype.initialize = function (frameCount, graphicCount) {
            if (frameCount === void 0) { frameCount = 500; }
            if (graphicCount === void 0) { graphicCount = 15; }
            var animation = grafika.getRenderer('animation').create();
            animation.timer = 25;
            this.grafika.setAnimation(animation);
            for (var i = 0; i < frameCount; i++) {
                var layer = this.grafika.getFrame().layers[0];
                for (var j = 0; j < graphicCount; j++) {
                    var graphic = this.drawRandom();
                    layer.graphics.push(graphic);
                }
                this.grafika.nextFrame();
            }
            this.grafika.play();
        };
        GrafikaRandomDrawing.prototype.drawRandom = function () {
            var _this = this;
            var drawFunctions = [
                function () {
                    var renderer = _this.grafika.getRenderer("circle");
                    var circle = renderer.create();
                    circle.radius = Math.floor(Math.random() * _this.grafika.getAnimation().width) + 1;
                    return circle;
                },
                function () {
                    var pointCount = 10;
                    var renderer = _this.grafika.getRenderer("freeform");
                    var freeform = renderer.create();
                    for (var i = 0; i < pointCount; i++) {
                        freeform.points.push(_this.randomPoint());
                    }
                    return freeform;
                }
            ];
            var g = drawFunctions[Math.floor(Math.random() * drawFunctions.length)]();
            var point = this.randomPoint();
            g.x = point.x;
            g.y = point.y;
            return g;
        };
        GrafikaRandomDrawing.prototype.randomPoint = function () {
            return {
                x: Math.floor(Math.random() * grafika.getAnimation().width) + 1,
                y: Math.floor(Math.random() * grafika.getAnimation().height) + 1
            };
        };
        return GrafikaRandomDrawing;
    }());
    return grafika.random = new GrafikaRandomDrawing(grafika);
});
//# sourceMappingURL=grafika.random-drawing.js.map