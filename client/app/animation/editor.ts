module GrafikaApp {
    export class AnimationEditorController {
        grafika: Grafika.IGrafika = new Grafika();

        public static $inject = [
            '$rootScope',
            '$stateParams',
            'appCommon',
            'animationService',
            'frameService'
        ];
        constructor(
            private $rootScope: ng.IRootScopeService,
            private $stateParams: ng.ui.IStateParamsService,
            private appCommon: AppCommon,
            private animationService: AnimationService,
            private frameService: FrameService
        ){
            this.load();
        }

        load() {
            this.animationService.get(this.$stateParams['_id']).then((res) => {
                this.grafika.initialize('#canvas', { drawingMode: 'paint' }, res.data);
                this.frameService.get(this.grafika.getAnimation()).then((res) => {
                    this.grafika.setFrames(res.data);
                })
            });
        }

		save() {
			this.grafika.save();
			this.animationService.update(this.grafika.getAnimation()).then((res) => {
                this.appCommon.toast('Saved!');
            })
		}
    }
}