module GrafikaApp {
    export abstract class BaseBackgroundController extends AuthController {
        busy: boolean = false;
        background: Grafika.IBackground;

        public static $inject = ['appCommon', 'authService', 'backgroundService', 'resourceService'];
        constructor(
            appCommon: AppCommon, 
            authService: AuthService,
            protected backgroundService: BackgroundService,
            protected resourceService: ResourceService,
            autoLoad: boolean = true
        )
        {
            super(appCommon, authService);
            if (autoLoad)
                this.load();
        }

        load() {
            this.busy = true;
            this.backgroundService.get(this.appCommon.$stateParams['_id'])
                .then((res) => {
                    this.background = res.data;
                    return this.onLoaded(this.background);
                })
                .catch((err) => this.onError(err))
                .finally(() => this.busy = false);
        }
        
        onError(error: any) {
            this.appCommon.$log.error(this.appCommon.formatErrorMessage(error));   
        }

        abstract onLoaded(background: Grafika.IBackground): ng.IPromise<any>;
    }
}