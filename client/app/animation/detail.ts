module GrafikaApp {
    export class AnimationDetailController {
        animation: Grafika.IAnimation;
        canEdit: boolean: false;

        public static $inject = [
            '$stateParams',
            'appCommon',
            'animationService',
            'frameService',
            'authService'
        ];
        constructor(
            $stateParams: ng.ui.IStateParamsService,
            appCommon: AppCommon,
            animationService: AnimationService,
            frameService: FrameService,
            authService: AuthService
        ){
            animationService.get($stateParams['_id']).then((res) => {
                this.animation = res.data;
                this.canEdit = authService.getUser()._id === this.animation.userId;
            });
        }
    }
}