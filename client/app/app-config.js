var GrafikaApp;
(function (GrafikaApp) {
    var AppConfig = (function () {
        function AppConfig() {
            this.appTitle = 'Grafika';
            this.appVersion = '0.9.0';
            this.baseUrl = '';
            this.defaultBaseUrl = 'https://grafika.herokuapp.com/';
            this.apiBaseUrl = '/api/';
            this.resourceBaseUrl = 'https://s3.amazonaws.com/grafika/resources/';
            this.userBaseUrl = 'https://s3.amazonaws.com/grafika/users/';
            this.fetchSize = 25;
        }
        return AppConfig;
    }());
    GrafikaApp.AppConfig = AppConfig;
})(GrafikaApp || (GrafikaApp = {}));
//# sourceMappingURL=app-config.js.map