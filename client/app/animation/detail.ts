module GrafikaApp {
    export class AnimationDetailController {
        animation: Grafika.IAnimation;

        public static $inject = [
            '$stateParams',
            'appCommon',
            'animationService',
            'frameService'
        ];
        constructor(
            $stateParams: ng.ui.IStateParamsService,
            appCommon: AppCommon,
            animationService: AnimationService,
            frameService: FrameService
        ){
            animationService.get($stateParams['_id']).then((res) => {
                this.animation = res.data;
            });
        }
    }
}