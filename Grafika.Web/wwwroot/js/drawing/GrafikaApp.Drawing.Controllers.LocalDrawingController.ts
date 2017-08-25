module GrafikaApp {
    export module Drawing {
        export module Controllers {
            export class LocalDrawingController extends DrawingController {
                public static $inject = ['appCommon', 'authService', 'animationService', 'frameService', 'resourceService', '$rootScope', '$scope'];
                constructor(
                    appCommon: AppCommon,
                    authService: Services.AuthService,
                    animationService: Services.AnimationService,
                    frameService: Services.FrameService,
                    resourceService: Services.ResourceService,
                    $rootScope: angular.IRootScopeService,
                    $scope: angular.IScope
                ) {
                    super(appCommon, authService, animationService, frameService, resourceService, $rootScope, $scope);
                    this.supportsResources = false;
                }

                load(animationId?: string) {
                    this.tryLoadFromStorage()
                        .then(() => this.appCommon.hideLoadingModal())
                        .catch(() => {
                            this.createNewAnimation();
                            this.appCommon.hideLoadingModal();
                            return this.showProperties(undefined);
                        })
                        .finally(() => {
                            this.grafikaReady = true;
                        });
                }

                save(exit: boolean) {
                    this.grafika.save();
                    this.grafika.exts.getCanvasData((err, data) => {
                        if (err) {
                            toastError(GrafikaApp.formatError(err).message);
                            return;
                        }

                        this.appCommon.putStorageItem(GrafikaApp.StorageAnimationKey, this.grafika.getAnimation());
                        this.appCommon.putStorageItem(GrafikaApp.StorageFramesKey, this.grafika.getFrames());
                        this.appCommon.putStorageItem(GrafikaApp.StorageThumbnailKey, data.base64);

                        this.appCommon.toast('Successfully saved!');

                        if (exit) {
                            bootbox.alert('We will save this animation locally. In order to publish this, please register', () => this.exit());
                        }
                    });
                }

                exit() {
                    this.appCommon.showLoadingModal();
                    this.grafika.save();
                    GrafikaApp.navigateHome();
                }

                /////////////////////////////////////////////////////////////////////////////////////////////////////////

                private tryLoadFromStorage(): ng.IPromise<any> {
                    let checkExistingPromise: ng.IPromise<any> = this.appCommon.$q((resolve, reject) => {
                        if (this.appCommon.hasStorageItem(GrafikaApp.StorageAnimationKey)) {
                            if (GrafikaApp.getQueryString('load') === 'true') {
                                resolve();
                            }
                            else {
                                bootbox.confirm({
                                    title: 'Unsaved Animation',
                                    message: 'Welcome back! <br/>It looks like you have unsaved animation.<br/> Would you like to reload it?',
                                    callback: (result) => {
                                        if (result) resolve();
                                        else reject();
                                    }
                                });
                            }
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
                        localId: Grafika.randomUid(),
                        author: 'Anonymous',
                        isPublic: true,
                        type: 'Animation'
                    } as Grafika.IAnimation;

                    this.grafika.initialize('#canvas', { drawingMode: 'paint', useNavigationText: false }, this.animation);
                    this.grafika.setFrames(this.createFirstFrames());

                    return this.appCommon.$q.when(true);
                }

            }
        }
    }
}