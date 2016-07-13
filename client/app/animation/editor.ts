module grafikaApp {
    export class AnimationEditorController {
        grafika: any;

        public static $inject = [
            '$rootScope',
            '$stateParams',
            'animationService',
            'frameService'
        ];
        constructor(
            private $rootScope: ng.IRootScopeService,
            private $stateParams: ng.ui.IStateParamsService,
            private animationService: AnimationService,
            private frameService: FrameService
        ){
            this.load();
        }

        load() {
            this.animationService.get(this.$stateParams['_id']).then(function (res) {
                this.grafika.initialize('#canvas', { drawingMode: 'paint' }, res.data);
                this.frameService.get(this.grafika.getAnimation()).then(function (res) {
                    this.grafika.setFrames(res.data);
                })
            });
        }

		save() {
			this.grafika.save();
			this.animationService.update(this.grafika.getAnimation());
			this.frameService.update(this.grafika.getAnimation(), this.grafika.getFrames());
		}
    }
}