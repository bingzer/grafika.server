module GrafikaApp {
    export module Drawing {
        export module Controllers {
            export abstract class BaseAnimationController extends AuthController {
                busy: boolean = false;
                animation: Grafika.IAnimation;

                public static $inject = ['appCommon', 'authService', 'animationService', 'frameService', 'resourceService'];
                constructor(
                    appCommon: AppCommon,
                    authService: Services.AuthService,
                    protected animationService: Services.AnimationService,
                    protected frameService: Services.FrameService,
                    protected resourceService: Services.ResourceService,
                    autoLoad: boolean = true
                ) {
                    super(appCommon, authService);
                    if (autoLoad)
                        this.load();
                }

                load(animationId?: string) {
                    this.busy = true;
                    let promise: ng.IPromise<Grafika.IAnimation>;
                    if (animationId) {
                        promise = this.animationService.get(animationId).then((res) => {
                            return this.appCommon.$q.when(res.data)
                        });
                    }
                    else {
                        // create a new one
                        let animation: Grafika.IAnimation = {
                            _id: undefined,
                            localId: this.appCommon.randomUid(),
                            type: 'animation'
                        } as Grafika.IAnimation;
                        promise = this.appCommon.$q.when(animation);
                    }
                    
                    promise.then(anim => {
                        this.animation = anim;
                        return this.onLoaded(anim);
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
    }
}