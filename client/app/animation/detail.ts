module GrafikaApp {
    export class AnimationDetailController extends BaseAnimationController {
        disqusReady: boolean = false;
        canEdit: boolean = false;
        disqusConfig: DisqusConfig;

        public static $inject = ['appCommon', 'authService', 'uxService', 'animationService', 'frameService', 'resourceService'];
        constructor(
            appCommon: AppCommon,
            authService: AuthService, 
            private uxService: UxService,
            animationService: AnimationService, 
            frameService: FrameService, 
            resourceService: ResourceService){
            super(appCommon, authService, animationService, frameService, resourceService);
        }
        
        onLoaded(animation: Grafika.IAnimation){
            this.uxService.pageTitle = this.animation.name;
            this.disqusConfig = new DisqusConfig(this.appCommon, animation._id);
            this.disqusConfig.disqus_title = animation.name;
            this.disqusConfig.disqus_url = this.appCommon.$location.absUrl();

            if (this.authService.isAuthorized('user')){
                this.canEdit = this.authService.getUser()._id === this.animation.userId;
                this.authService.getDisqusToken().then((res) => {
                    if (this.authService.isAuthenticated()){
                        //this.disqusConfig.disqus_category_id = 'Animation';
                        this.disqusConfig.disqus_remote_auth_s3 = res.data.token;
                        this.disqusReady = true;
                    }
                });
            }
            else {
                this.disqusReady = true;
            }
        }

        onError(err: any){
            this.appCommon.alert("An error has occured").then(() => this.appCommon.navigateHome());
        }

        edit() {
            this.appCommon.$state.go("drawing", {_id: this.animation._id});
        }

        editData(ev: MouseEvent) {
            this.appCommon.showDialog('AnimationEditController', '/app/animation/edit.html', ev).then(() => this.load());
        }

        delete(): ng.IPromise<any> {
            return this.appCommon.confirm('Delete?').then(() => {
                return this.animationService.delete(this.animation._id).then(() => {
                    this.appCommon.navigateHome();
                    return this.appCommon.toast('Deleted');
                });
            });
        }
    }
}