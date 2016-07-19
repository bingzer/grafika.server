module GrafikaApp {
    export class MyAnimationsController extends AnimationListController {

        public static $inject = ['appCommon', 'animationService', 'authService' ];
        constructor(
            appCommon: AppCommon,
            animationService: AnimationService,
            authService: AuthService
        ){
            super(appCommon, animationService, authService);
        }

        list() {
            var paging = new Paging({ isPublic: false, userId: this.authService.getUser()._id });
            this.animationService.list(paging).then((res) => {
                this.animations = res.data;
            });
        }
        
        create(ev: MouseEvent){
    		var useFullScreen = (this.appCommon.$mdMedia('sm') || this.appCommon.$mdMedia('xs'));
            this.appCommon.$mdDialog.show({
                controller: 'AnimationCreateController',
                controllerAs: 'vm',
                parent: angular.element(document.body),
                templateUrl: '/app/animation/create.html',
                clickOutsideToClose: true,
                targetEvent: ev
            }).then((answer) => {
                this.appCommon.toast('Animation is created');
            });
		} 
    }
}