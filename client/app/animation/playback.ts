module GrafikaApp {
    export class AnimationPlaybackController extends BaseAnimationController {
        grafika: Grafika.IGrafika;
        totalFrame: number = 0;
        currentFrame: number = 0;
        isPlaying: boolean = false;
        animationName: string = 'loading...';
        
        public static $inject = ['appCommon', 'authService', 'animationService', 'frameService', 'resourceService', '$scope'];
        constructor(
            appCommon: AppCommon, 
            authService: AuthService,
            animationService: AnimationService,
            frameService: FrameService,
            resourceService: ResourceService,
            private $scope: ng.IScope
        ){
            super(appCommon, authService, animationService, frameService, resourceService);
        }

        onLoaded(animation: Grafika.IAnimation) {
            this.animationName = this.animation.name;
            if (!this.grafika)
                this.grafika = new Grafika();
            this.grafika.initialize('#canvas', this.getOptions(), this.animation);
            this.grafika.setCallback({ on: (ev: string, obj: any) => {
                switch (ev) {
                    case 'frameChanged':
                        this.currentFrame = parseInt(obj);
                        this.$scope.$applyAsync('vm.currentFrame');
                        break;
                    case 'playing':
                        this.isPlaying = obj;
                        this.$scope.$applyAsync('vm.isPlaying');
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

        private getOptions() {
            let opts: any = { useNavigationText: false, useCarbonCopy: false };
            
            let user = this.authService.getUser();
            if (user) {
                opts.loop = user.prefs.playbackLoop; 
            }

            return opts;
        }
    }
}