var GrafikaApp;
(function (GrafikaApp) {
    var AppConfig = (function () {
        function AppConfig() {
            this.appTitle = 'Grafika';
            this.appVersion = '0.9.17-5';
            this.baseUrl = '';
            this.defaultBaseUrl = 'https://grafika.herokuapp.com/';
            this.apiBaseUrl = 'api/';
            this.animationBaseUrl = 'https://s3.amazonaws.com/bingzer/grafika/animations/';
            this.userBaseUrl = 'https://s3.amazonaws.com/bingzer/grafika/users/';
            this.fetchSize = 10;
        }
        return AppConfig;
    }());
    GrafikaApp.AppConfig = AppConfig;
})(GrafikaApp || (GrafikaApp = {}));
//# sourceMappingURL=app-config.js.map