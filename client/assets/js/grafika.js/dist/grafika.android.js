Grafika.Plugins.push(function (grafika) {
    var GrafikaAndroidPlugin = (function () {
        function GrafikaAndroidPlugin(grafika) {
            var _this = this;
            this.grafika = grafika;
            this.name = 'Android Api';
            this.version = '1.0.0';
            this.on = function (event, obj) {
                console.log('[GrafikaAndroid] ' + event + ' : ' + obj);
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
        }
        return GrafikaAndroidPlugin;
    }());
    var plugin = new GrafikaAndroidPlugin(grafika);
    if (typeof GrafikaAndroid !== 'undefined')
        grafika.setCallback(plugin);
    return plugin;
});
//# sourceMappingURL=grafika.android.js.map