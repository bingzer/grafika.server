module GrafikaApp {
    export class AnimationDetailController extends BaseAnimationController {
        canEdit: boolean = false;

        public static $inject = ['appCommon', 'authService', 'animationService', 'frameService', 'resourceService'];
        constructor(
            appCommon: AppCommon, 
            authService: AuthService, 
            animationService: AnimationService, 
            frameService: FrameService, 
            resourceService: ResourceService){
            super(appCommon, authService, animationService, frameService, resourceService);
        }
        
        onLoaded(animation: Grafika.IAnimation){
            if (this.authService.isAuthorized('user'))
                this.canEdit = this.authService.getUser()._id === this.animation.userId;
        }
        edit() {
            this.appCommon.$state.go("drawing", {_id: this.animation._id});
        }

        editData(ev: MouseEvent) {
            this.appCommon.$mdDialog.show({
                controller: 'AnimationEditController',
                controllerAs: 'vm',
                parent: angular.element(document.body),
                templateUrl: '/app/animation/edit.html',
                clickOutsideToClose: true,
                targetEvent: ev
            }).then(() => this.load());
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