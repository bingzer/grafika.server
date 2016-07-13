/// <reference path="../grafika.d.ts"/>

module grafikaApp {
    export class AnimationDetailController {
        grafika: any;

        public static $inject = [
            '$rootScope',
            '$stateParams',
            'animationService',
            'frameService'
        ];
        constructor(
            public $rootScope: ng.IRootScopeService,
            public $stateParams: ng.ui.IStateParamsService,
            public animationService: AnimationService,
            public frameService: FrameService
        ){
            this.animationService.get($stateParams['_id']).then(function (res) {
                this.grafika.initialize('#canvas', { useNavigationText: false, useCarbonCopy: false }, res.data);
                frameService.get(this.grafika.getAnimation()).then(function (res) {
                    this.grafika.setFrames(res.data);
                })
            });
        }
    }
}