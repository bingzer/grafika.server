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

        onLoaded(animation: Grafika.IAnimation): ng.IPromise<any> {
            this.animationName = this.animation.name;
            if (!this.grafika)
                this.grafika = new Grafika();
            this.grafika.initialize('#canvas', this.getOptions(), this.animation);
            this.grafika.setCallback({ on: (ev: string, obj: any) => {
                switch (ev) {
                    case Grafika.EVT_FRAME_CHANGED:
                        this.currentFrame = parseInt(obj);
                        this.$scope.$applyAsync('vm.currentFrame');
                        break;
                    case Grafika.EVT_PLAYING:
                        this.isPlaying = obj;
                        this.$scope.$applyAsync('vm.isPlaying');
                        break;
                } 
            }});

            return this.frameService.get(animation)
                .then((res) => {
                    this.grafika.setFrames(res.data);
                    this.totalFrame = res.data.length;
                    this.currentFrame = 0;
                    this.animationService.incrementViewCount(animation);
                    return this.appCommon.$q.when(animation);
                })
                .catch((err) => {
                    this.appCommon.alert(this.appCommon.formatErrorMessage(err))
                        .then(() => this.appCommon.navigateHome());
                });
        }

        toggle() {
            this.grafika.animation.currentFrame = this.currentFrame;
            if (this.grafika.isPlaying())
                this.grafika.pause();
            else this.grafika.play();
        }

        togglePlaybackLoop(){
            this.grafika.setOptions({ loop: !this.grafika.getOptions().loop });
        }

        previousFrame() {
            this.grafika.previousFrame();
        }

        nextFrame() {
            this.grafika.nextFrame();
        }

        navigateToFrame(){
            this.grafika.navigateToFrame(this.currentFrame);
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