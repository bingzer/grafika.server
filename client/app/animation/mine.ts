module GrafikaApp {
    export class MyAnimationsController {
        animations: Animation[];

        public static $inject = [
            '$rootScope',
            '$mdDialog',
            'animationService',
            'authService'
        ];
        constructor(
            private $rootScope: ng.IRootScopeService,
            private $mdDialog: ng.material.IDialogService,
            private animationService: AnimationService,
            private authService: AuthService
        ){
            this.list();
        }

        list() {
            var paging = this.animationService.createPaging();
            paging.userId = this.authService.getUser()._id;
            this.animationService.list(paging).then(function (res){
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
					//$scope.status = 'You said the information was "' + answer + '".';
				}, function() {
					//$scope.status = 'You cancelled the dialog.';
			});
		} 
    }
}