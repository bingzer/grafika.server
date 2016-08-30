module GrafikaApp {
    export class AnimationDrawingController extends BaseAnimationController implements Grafika.ICallback {
        grafika: Grafika.IGrafika = new Grafika();
        currentFrame: number = 1;
        totalFrame: number = 0;
        canvas: JQuery;
        
        public static $inject = ['appCommon', 'authService', 'uxService', 'animationService', 'frameService', 'resourceService'];
        constructor(
            appCommon: AppCommon, 
            authService: AuthService,
            private uxService: UxService,
            protected animationService: AnimationService,
            protected frameService: FrameService,
            protected resourceService: ResourceService
        ){
            super(appCommon, authService, animationService, frameService, resourceService);
            this.appCommon.hideLoadingModal();
            this.grafika.setCallback(this);
        }

        on(eventName: string, obj: any) {
            switch(eventName) {
                case "frameChanged":
                    this.currentFrame = (<number> obj) + 1;
                case "frameCount":
                    this.totalFrame = this.grafika.getAnimation().frames.length;
                    break;
            }
        } 

        onLoaded(animation: Grafika.IAnimation) {
            this.uxService.pageTitle = 'Edit ' + this.animation.name;
            this.canvas = this.appCommon.elem('#canvas').contextmenu(this.captureContextMenu);
            this.appCommon.elem('#canvas-container').css('width', this.animation.width).css('height', this.animation.height);
            this.frameService.get(this.animation).then((res) => {
                this.animation.frames = res.data;
                this.grafika.initialize('#canvas', { drawingMode: 'paint' }, this.animation);
            })
        }

        showProperties(ev: MouseEvent) {
            return this.appCommon.showDialog('AnimationEditController', '/app/animation/edit.html', ev).then(() => this.load());
        }

		save(exit: boolean) {
			this.grafika.save();

            let animation = this.grafika.getAnimation();
			this.animationService.update(animation)
                .then((res) => this.frameService.update(animation, this.grafika.getFrames()))
                .then((res) => this.resourceService.saveThumbnail(animation) )
                .then((res) => this.resourceService.upload(res.data, this.grafika.exts.getCanvasBlob()) )
                .then((res) => {
                    if (exit) this.exit();
                    this.appCommon.toast('Successfully saved!');
                });
		}

        confirmExit() {
            let anim: any = this.animation;
            if (anim.modified) this.appCommon.confirm('Close?').then(() => this.exit());
            else this.exit();
        }

        exit() {
            this.appCommon.$state.go('my-animations');
        }

        ////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

        private captureContextMenu(event: JQueryMouseEventObject) {
            if (!this.canvas) return;
			this.canvas.attr('context-menu-x', event.offsetX).attr('context-menu-y', event.offsetY);
        }
    }
}