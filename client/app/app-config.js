var GrafikaApp;
(function (GrafikaApp) {
    var AppConfig = (function () {
        function AppConfig() {
            this.appTitle = 'Grafika';
            this.appVersion = '0.9.19-14';
            this.appBuildTimestamp = 'Wed Aug 24 2016 16:52:13 GMT-0400 (Eastern Daylight Time)';
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
                { key: '-dateModified', value: 'Newest' },
                { key: '-views', value: 'Views' },
                { key: '-rating', value: 'Ratings' }
            ];
        }
        return AppConfig;
    }());
    GrafikaApp.AppConfig = AppConfig;
})(GrafikaApp || (GrafikaApp = {}));
//# sourceMappingURL=app-config.js.map