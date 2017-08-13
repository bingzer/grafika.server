module GrafikaApp {
    export class AppConfig {
        appTitle: string = 'Grafika';
        appVersion: string = '1.0.12'; // injected by grunt
        appBuildTimestamp: string = 'Tue May 02 2017 21:38:45 GMT-0400 (Eastern Daylight Time)'; // injected by grunt

        fbAppId = ''

        baseUrl: string = ''; // injected by app-controller
        apiBaseUrl: string = '';  // injected by app-controller

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