module GrafikaApp {
    export class AppConfig {
        appTitle: string = 'Grafika';
        appVersion: string = '0.9.17-4';
        baseUrl: string = ''; // injected by app-controller
        defaultBaseUrl: string = 'https://grafika.herokuapp.com/';  // default url if baseUrl is localhost
        apiBaseUrl: string = '/api/';  // local
        animationBaseUrl: string = 'https://s3.amazonaws.com/bingzer/grafika/animations/';
        userBaseUrl: string = 'https://s3.amazonaws.com/bingzer/grafika/users/';
        fetchSize: number = 25;
    }
}