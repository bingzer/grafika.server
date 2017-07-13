Grafika.Plugins.push(function (grafika) {
    var GrafikaAndroidPlugin = (function () {
        function GrafikaAndroidPlugin(grafika) {
            var _this = this;
            this.grafika = grafika;
            this.name = 'Android Api';
            this.version = '1.0.0';
            this.on = function (event, obj) {
                Grafika.log(_this, event + " + ' : ' + " + obj);
                if (!GrafikaAndroid)
                    throw new Error('GrafikaAndroid is not yet activated');
                GrafikaAndroid.invoke(event, obj + "");
                switch (event) {
                    case "animationSaved":
                        if (_this.grafika.getAnimation().client) {
                            _this.grafika.getAnimation().client.name = 'Grafika Android';
                        }
                        break;
                }
            };
            this.getName = function () { return ("[" + _this.name + " " + _this.version + "]"); };
            this.isLogEnabled = function () { return _this.grafika.getOptions().debugMode; };
            this.loadFrameData = function (anim) {
                var animId = anim._id || anim;
                ajax("GET", "grafika://animations/" + animId + "/frames", function (err, result) {
                    if (err)
                        Grafika.log(_this, err.message);
                    _this.grafika.setFrames(result);
                });
            };
        }
        return GrafikaAndroidPlugin;
    }());
    var plugin = new GrafikaAndroidPlugin(grafika);
    if (Grafika.isDefined(typeof GrafikaAndroid))
        grafika.setCallback(plugin);
    return grafika.android = plugin;
    function ajax(method, url, callback) {
        var http = new XMLHttpRequest();
        http.onreadystatechange = function () {
            if (http.readyState == XMLHttpRequest.DONE) {
                if (http.status == 200)
                    callback(undefined, JSON.parse(http.responseText));
                else
                    callback(new Error(http.statusText));
            }
        };
        http.open("GET", url, true);
        http.send();
    }
});
//# sourceMappingURL=grafika.android.js.map