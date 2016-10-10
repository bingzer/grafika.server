module GrafikaApp {
    export class AppConfig {
        appTitle: string = 'Grafika';
        appVersion: string = '0.9.19-51'; // injected by grunt
        appBuildTimestamp: string = 'Mon Oct 10 2016 19:38:34 GMT-0400 (Eastern Daylight Time)'; // injected by grunt
        baseUrl: string = ''; // injected by app-controller
        defaultBaseUrl: string = 'https://grafika.herokuapp.com/';  // default url if baseUrl is localhost
        apiBaseUrl: string = 'api/';  // local
        animationBaseUrl: string = 'https://s3.amazonaws.com/bingzer/grafika/animations/';
        userBaseUrl: string = 'https://s3.amazonaws.com/bingzer/grafika/users/';
        contentBaseUrl: string = 'https://github.com/bingzer/grafika/';
        fetchSize: number = 10;
        defaultAnimationWidth: number = 800;
        defaultAnimationHeight: number = 450;
        animationSorts: any = [
            { key: '-dateModified', value: 'Newest' },
            { key: '-views', value: 'Views' },
            { key: '-rating', value: 'Ratings' }
        ];
    }
}