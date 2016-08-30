module GrafikaApp {
    export abstract class BaseAnimationController extends AuthController {
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
            this.animationService.get(this.appCommon.$stateParams['_id'])
                .then((res) => {
                    this.animation = res.data;
                    this.onLoaded(this.animation);
                })
                .catch((err) => this.onError(err));
        }
        
        onError(error: any) {
            this.appCommon.$log.error(this.appCommon.formatErrorMessage(error));   
        }

        abstract onLoaded(animation: Grafika.IAnimation);
    }
}