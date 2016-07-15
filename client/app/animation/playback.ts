module GrafikaApp {
    export class AnimationPlaybackController {
        grafika: Grafika.IGrafika;
        totalFrame: number = 0;
        currentFrame: number = 0;
        isPlaying: boolean = false;
        animationName: string = 'loading...';

        public static $inject = [
            '$stateParams',
            'animationService',
            'frameService'
        ];
        constructor(
            private $stateParams: ng.ui.IStateParamsService,
            private animationService: AnimationService,
            private frameService: FrameService
        ){
            this.grafika = new Grafika();
        }

        load() {
            var controller = this;
            this.animationService.get(this.$stateParams['_id']).then((res) => {
                this.animationName = res.data.name;
                this.grafika.initialize('#canvas', { useNavigationText: false, useCarbonCopy: false }, res.data);
                this.grafika.setCallback({ on: (ev: string, obj: any) => {
                    switch (ev) {
                        case 'frameChanged':
                            controller.currentFrame = obj;
                            break;
                        case 'playing':
                            controller.isPlaying = obj;
                            break;
                    } 
                }});
                this.frameService.get(this.grafika.getAnimation()).then((res) => {
                    this.grafika.setFrames(res.data);
                    this.totalFrame = res.data.length;
                    this.currentFrame = 0;
                })
            });
        }

        toggle() {
            if (this.grafika.isPlaying())
                this.grafika.pause();
            else this.grafika.play();
        }

        previousFrame() {
            this.grafika.previousFrame();
        }

        nextFrame() {
            this.grafika.nextFrame();
        }
    }
}