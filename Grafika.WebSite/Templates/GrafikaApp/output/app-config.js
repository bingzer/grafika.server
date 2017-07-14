var GrafikaApp;
(function (GrafikaApp) {
    var AppConfig = (function () {
        function AppConfig() {
            this.appTitle = 'Grafika';
            this.appVersion = '1.0.12'; // injected by grunt
            this.appBuildTimestamp = 'Tue May 02 2017 21:38:45 GMT-0400 (Eastern Daylight Time)'; // injected by grunt
            this.fbAppId = '';
            this.baseUrl = ''; // injected by app-controller
            this.apiBaseUrl = ''; // injected by app-controller
            this.animationBaseUrl = 'https://s3.amazonaws.com/bingzer/grafika/animations/';
            this.userBaseUrl = 'https://s3.amazonaws.com/bingzer/grafika/users/';
            this.contentBaseUrl = 'https://github.com/bingzer/grafika/';
            this.fetchSize = 10;
            this.defaultAnimationWidth = 800;
            this.defaultAnimationHeight = 450;
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
//# sourceMappingURL=C:/Users/ricky/GrafikaProject/grafika.server/Grafika.WebSite/Tempaltes/GrafikaApp/output/app-config.js.map