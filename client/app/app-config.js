var GrafikaApp;
(function (GrafikaApp) {
    var AppConfig = (function () {
        function AppConfig() {
            this.appTitle = 'Grafika';
            this.appVersion = '0.9.19-10';
            this.appBuildTimestamp = 'Mon Aug 22 2016 08:23:21 GMT-0400 (Eastern Daylight Time)';
            this.baseUrl = '';
            this.defaultBaseUrl = 'https://grafika.herokuapp.com/';
            this.apiBaseUrl = 'api/';
            this.animationBaseUrl = 'https://s3.amazonaws.com/bingzer/grafika/animations/';
            this.userBaseUrl = 'https://s3.amazonaws.com/bingzer/grafika/users/';
            this.contentBaseUrl = 'https://github.com/bingzer/grafika/';
            this.fetchSize = 10;
            this.defaultAnimationWidth = 800;
            this.defaultAnimationHeight = 400;
            this.animationSorts = [
                { key: 'newest', value: 'Newest' },
                { key: 'views', value: 'Views' },
                { key: 'rating', value: 'Ratings' }
            ];
        }
        return AppConfig;
    }());
    GrafikaApp.AppConfig = AppConfig;
})(GrafikaApp || (GrafikaApp = {}));
//# sourceMappingURL=app-config.js.map