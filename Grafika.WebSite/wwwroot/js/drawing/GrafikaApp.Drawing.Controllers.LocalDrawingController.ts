module GrafikaApp {
    export module Drawing {
        export module Controllers {
            export class LocalDrawingController extends DrawingController {
                public static $inject = ['appCommon', 'authService', 'animationService', 'frameService', 'resourceService', '$rootScope'];
                constructor(
                    appCommon: AppCommon,
                    authService: Services.AuthService,
                    animationService: Services.AnimationService,
                    frameService: Services.FrameService,
                    resourceService: Services.ResourceService,
                    $rootScope: angular.IRootScopeService
                ) {
                    super(appCommon, authService, animationService, frameService, resourceService, $rootScope);
                }

                load(animationId?: string) {
                    this.tryLoadFromStorage()
                        .catch(() => this.createNewAnimation())
                        .finally(() => {
                            this.grafikaReady = true;
                            this.appCommon.hideLoadingModal();
                        });
                }

                save(exit: boolean) {
                    this.grafika.save();
                    this.appCommon.putStorageItem(GrafikaApp.StorageAnimationKey, this.grafika.getAnimation());
                    this.appCommon.putStorageItem(GrafikaApp.StorageFramesKey, this.grafika.getFrames());

                    this.appCommon.toast('Successfully saved!');

                    if (exit)
                        this.exit();
                }

                exit() {
                    this.appCommon.showLoadingModal();
                    this.grafika.save();
                    bootbox.alert('We will save this animation locally. In order to publish this, please register', () => {
                        GrafikaApp.navigateTo('/');
                    });
                }

                /////////////////////////////////////////////////////////////////////////////////////////////////////////

                private tryLoadFromStorage(): ng.IPromise<any> {
                    let checkExistingPromise: ng.IPromise<any> = this.appCommon.$q((resolve, reject) => {
                        if (this.appCommon.hasStorageItem(GrafikaApp.StorageAnimationKey)) {
                            bootbox.confirm({
                                title: 'Unsaved Animation',
                                message: 'Welcome back! <br/>It looks like you have unsaved animation.<br/> Would you like to reload it?',
                                callback: (result) => {
                                    if (result) resolve();
                                    else reject();
                                }
                            });
                        }
                        else reject();
                    });

                    let animPromise = this.appCommon.getStorageItem(GrafikaApp.StorageAnimationKey);
                    let framePromise = this.appCommon.getStorageItem(GrafikaApp.StorageFramesKey);

                    return checkExistingPromise
                        .then(() => animPromise)
                        .then((any) => {
                            this.animation = any as Grafika.IAnimation;
                            this.grafika.initialize('#canvas', { drawingMode: 'paint', useNavigationText: false }, this.animation);
                            return framePromise
                        }).then((any) => {
                            this.grafika.setFrames(any as Grafika.IFrame[]);
                            return this.appCommon.$q.when(true);
                        });
                }

                private createNewAnimation(): ng.IPromise<any> {
                    this.animation = {
                        name: 'New Animation',
                        width: 800,
                        height: 480,
                        localId: Grafika.randomUid()
                    } as Grafika.IAnimation;

                    this.grafika.initialize('#canvas', { drawingMode: 'paint', useNavigationText: false }, this.animation);
                    this.grafika.setFrames(this.createFirstFrames());

                    return this.appCommon.$q.when(true);
                }

            }
        }
    }
}