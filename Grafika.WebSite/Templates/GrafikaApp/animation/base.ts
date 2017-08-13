module GrafikaApp {
    export abstract class BaseAnimationController extends AuthController {
        busy: boolean = false;
        animation: Grafika.IAnimation;

        public static $inject = ['appCommon', 'authService', 'animationService', 'frameService', 'resourceService'];
        constructor(
            appCommon: AppCommon, 
            authService: AuthService,
            protected animationService: AnimationService,
            protected frameService: FrameService,
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
            this.animationService.get(this.appCommon.$stateParams['_id'])
                .then((res) => {
                    this.animation = res.data;
                    return this.onLoaded(this.animation);
                })
                .catch((err) => this.onError(err))
                .finally(() => this.busy = false);
        }
        
        onError(error: any) {
            this.appCommon.$log.error(this.appCommon.formatErrorMessage(error));   
        }

        abstract onLoaded(animation: Grafika.IAnimation): ng.IPromise<any>;
    }
}