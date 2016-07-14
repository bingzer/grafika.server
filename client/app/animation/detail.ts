module GrafikaApp {
    export class AnimationDetailController {
        grafika: any;

        public static $inject = [
            '$rootScope',
            '$stateParams',
            'animationService',
            'frameService'
        ];
        constructor(
            $rootScope: ng.IRootScopeService,
            $stateParams: ng.ui.IStateParamsService,
            animationService: AnimationService,
            frameService: FrameService
        ){
            this.grafika = new Grafika();

            animationService.get($stateParams['_id']).then((res) => {
                this.grafika.initialize('#canvas', { useNavigationText: false, useCarbonCopy: false }, res.data);
                frameService.get(this.grafika.getAnimation()).then((res) => {
                    this.grafika.setFrames(res.data);
                })
            });
        }
    }
}