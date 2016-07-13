module grafikaApp {
    export class AppConfig {
        appTitle: string = 'Grafika';
        appVersion: string = '0.9.0';
        baseUrl: string = ''; // injected by app-controller
        defaultBaseUrl: string = 'https://grafika.herokuapp.com/';  // default url if baseUrl is localhost
        apiBaseUrl: string = '/api/';  // local
        resourceBaseUrl: string = 'https://s3.amazonaws.com/grafika/resources/';
        userBaseUrl: string = 'https://s3.amazonaws.com/grafika/users/';
        fetchSize: number = 25;
    }
}