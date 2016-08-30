module GrafikaApp {
    export class AnimationDrawingController extends BaseAnimationController implements Grafika.ICallback {
        grafika: Grafika.IGrafika | any = new Grafika();
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
            super(appCommon, authService, animationService, frameService, resourceService, false);
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
                this.grafika.initialize('#canvas', { drawingMode: 'paint', useNavigationText: false }, this.animation);
            });
        }

        showProperties(ev: MouseEvent) {
            return this.appCommon.showDialog('/app/animation/edit.html', 'AnimationEditController', ev).then(() => this.load());
        }

        showFrameProperties(ev: MouseEvent) {
            let controller = new FrameController(this.appCommon, this.grafika);
            return this.appCommon.showDialog('/app/animation/drawing-frame.html', () => controller, ev);
        }

        showGraphicsProperties(ev: MouseEvent) {
            let controller = new GraphicController(this.appCommon, this.grafika);
            return this.appCommon.showDialog('/app/animation/drawing-graphics.html', () => controller, ev);
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
            if (this.grafika.isModified()) 
                this.appCommon.confirm('Close?').then(() => this.exit());
            else this.exit();
        }

        exit() {
            this.appCommon.$state.go('my-animations');
        }

        update() {
            this.canvas.removeClass("none paint select move delete");
            this.canvas.addClass(this.grafika.getOptions().drawingMode);
        }

        ////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

        private captureContextMenu(event: JQueryMouseEventObject) {
            if (!this.canvas) return;
			this.canvas.attr('context-menu-x', event.offsetX).attr('context-menu-y', event.offsetY);
        }
    }
    
    ////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

    class FrameController extends DialogController {
        protected frame: Grafika.IFrame;

        constructor(appCommon: AppCommon, protected grafika: Grafika.IGrafika | any) {
            super(appCommon);
            this.frame = this.grafika.getFrame();
        }

        close(response?: any): ng.IPromise<any> {
            this.grafika.refresh();
            return super.close();
        }
    }

    class GraphicController extends FrameController {
        protected graphics: Grafika.Graphics.IGraphic[];

        constructor(appCommon: AppCommon, grafika: Grafika.IGrafika | any) {
            super(appCommon, grafika);
            this.graphics = this.frame.layers[0].graphics
        }        

    }
}