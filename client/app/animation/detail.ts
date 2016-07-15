module GrafikaApp {
    export class AnimationDetailController {
        animation: Grafika.IAnimation;
        canEdit: boolean = false;

        public static $inject = [
            '$stateParams',
            'appCommon',
            'animationService',
            'authService'
        ];
        constructor(
            private $stateParams: ng.ui.IStateParamsService,
            private appCommon: AppCommon,
            private animationService: AnimationService,
            private authService: AuthService
        ){
            this.animationService.get(this.$stateParams['_id']).then((res) => {
                this.animation = res.data;
                if (this.authService.isAuthorized('user'))
                    this.canEdit = this.authService.getUser()._id === this.animation.userId;
            });
        }
    }
}