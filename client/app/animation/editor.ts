module GrafikaApp {
    export class AnimationEditorController {
        grafika: Grafika.IGrafika = new Grafika();

        public static $inject = [
            '$rootScope',
            '$stateParams',
            'appCommon',
            'animationService',
            'frameService',
            'resourceService'
        ];
        constructor(
            private $rootScope: ng.IRootScopeService,
            private $stateParams: ng.ui.IStateParamsService,
            private appCommon: AppCommon,
            private animationService: AnimationService,
            private frameService: FrameService,
            private resourceService: ResourceService
        ){
            this.load();
        }

        load() {
            this.animationService.get(this.$stateParams['_id']).then((res) => {
                let anim = res.data;
                this.appCommon.elem('#canvas-container').css('width', anim.width).css('height', anim.height);
                this.grafika.initialize('#canvas', { drawingMode: 'paint' }, anim);
                this.frameService.get(this.grafika.getAnimation()).then((res) => {
                    this.grafika.setFrames(res.data);
                })
            });
        }

		save() {
			this.grafika.save();

            let animation = this.grafika.getAnimation();
			this.animationService.update(animation).then((res) => {
                return this.resourceService.saveThumbnail(animation);
            }).then((res) => {
                return this.resourceService.upload(res.data, this.grafika.exts.getCanvasBlob());
            }).then((res) => {
                this.appCommon.toast('Successfully saved!');
            });
		}
    }
}