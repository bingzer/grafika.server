module grafikaApp {
    export class AnimationListController {
        animations: Animation[];

        public static $inject = [
            '$rootScope',
            'animationService'
        ];
        constructor(
            public $rootScope: ng.IRootScopeService,
            public animationService: AnimationService
        ){
            this.list();
        }

        list() {
            this.animationService.list().then((res) => {
                this.animations = res.data;
            })
        }
    }
}