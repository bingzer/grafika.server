module GrafikaApp {
    export class AnimationPlaybackController extends BaseAnimationController {
        grafika: Grafika.IGrafika;
        totalFrame: number = 0;
        currentFrame: number = 0;
        isPlaying: boolean = false;
        animationName: string = 'loading...';
        
        public static $inject = ['appCommon', 'authService', 'animationService', 'frameService', 'resourceService'];
        constructor(
            appCommon: AppCommon, 
            authService: AuthService,
            protected animationService: AnimationService,
            protected frameService: FrameService,
            protected resourceService: ResourceService
        ){
            super(appCommon, authService, animationService, frameService, resourceService);
        }

        onLoaded(animation: Grafika.IAnimation) {
            var controller = this;
            this.animationName = this.animation.name;
            this.appCommon.elem('#canvas-container').css('width', this.animation.width).css('height', this.animation.height);
            if (!this.grafika)
                this.grafika = new Grafika();
            this.grafika.initialize('#canvas', { useNavigationText: false, useCarbonCopy: false }, this.animation);
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