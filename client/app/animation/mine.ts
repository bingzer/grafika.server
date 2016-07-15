module GrafikaApp {
    export class MyAnimationsController {
        animations: Animation[];

        public static $inject = [
            '$rootScope',
            '$mdDialog',
            'appCommon',
            'animationService',
            'authService'
        ];
        constructor(
            private $rootScope: ng.IRootScopeService,
            private $mdDialog: ng.material.IDialogService,
            private appCommon: AppCommon,
            private animationService: AnimationService,
            private authService: AuthService
        ){
            this.list();
        }

        list() {
            var paging = this.animationService.createPaging();
            paging.userId = this.authService.getUser()._id;
            this.animationService.list(paging).then((res) => {
                this.animations = res.data;
            });
        }
        
        create(ev: MouseEvent){
    		var useFullScreen = false;//($mdMedia('sm') || $mdMedia('xs'));
            this.$mdDialog.show({
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