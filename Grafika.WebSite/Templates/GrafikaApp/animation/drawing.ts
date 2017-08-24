module GrafikaApp {
    export class AnimationDrawingController extends BaseAnimationController implements Grafika.ICallback {
        grafika: Grafika.IGrafika = new Grafika();
        currentFrame: number = 1;
        totalFrame: number = 0;
        canvas: JQuery;
        grafikaReady: boolean = false;
        graphics = ['freeform', 'line', 'rectangle', 'square', 'circle', 'oval', 'triangle', 'text'];
        
        public static $inject = ['appCommon', 'authService', 'uxService', 'animationService', 'frameService', 'resourceService', '$rootScope'];
        constructor(
            appCommon: AppCommon, 
            authService: AuthService,
            private uxService: UxService,
            protected animationService: AnimationService,
            protected frameService: FrameService,
            protected resourceService: ResourceService,
            $rootScope: angular.IRootScopeService
        ){
            super(appCommon, authService, animationService, frameService, resourceService, false);
            this.grafika.setCallback(this);

            window['grafika'] = this.grafika;
        }

        on(eventName: string, obj: any) {
            switch(eventName) {
                case Grafika.EVT_FRAME_CHANGED:
                    this.currentFrame = (<number> obj) + 1;
                    $('#currentFrame').val(this.currentFrame);
                    break;
                case Grafika.EVT_FRAME_COUNT:
                    this.totalFrame = <number> obj;
                    break;
                case Grafika.EVT_GRAPHIC_SELECTED:
                    this.update();
                    break;
            }
        } 

        onLoaded(animation: Grafika.IAnimation): ng.IPromise<any> {
            this.uxService.pageTitle = 'Edit ' + this.animation.name;
            this.canvas = this.appCommon.elem('#canvas').contextmenu(this.captureContextMenu);
            this.appCommon.elem('#canvas-container').css('max-width', this.animation.width).css('max-height', this.animation.height);

            return this.frameService.get(this.animation).then((res) => {
                this.grafika.initialize('#canvas', { drawingMode: 'paint', useNavigationText: false }, this.animation);
                this.grafika.setFrames(res.data);
                this.grafikaReady = true;
                return this.appCommon.$q.when(this.animation);
            }).catch((err) => {
                // most likely this is a new animation
                this.grafika.initialize('#canvas', { drawingMode: 'paint', useNavigationText: false }, this.animation);
                this.grafika.setFrames(this.createFirstFrame());
                this.grafikaReady = true;
                return this.appCommon.$q.when(this.animation);
            }).finally(() => {
                this.appCommon.hideLoadingModal();
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
            return this.appCommon.showDialog('/app/animation/drawing-graphics.html', () => controller, ev)
                        .then(() => this.grafika.refreshFrame());
        }

		save(exit: boolean) {
			this.grafika.save();

            let animation = this.grafika.getAnimation();
			this.animationService.update(animation)
                .then((res) => this.frameService.update(animation, this.grafika.getFrames()))
                .then((res) => this.resourceService.saveThumbnail(animation) )
                .then((res) => {
                    let defer = this.appCommon.$q.defer();
                    this.grafika.exts.getCanvasBlob((err, data) => {
                        if (err) return defer.reject();
                        this.resourceService.upload(res.data, data)
                            .then(() => defer.resolve()).catch((reason) => defer.reject(reason));
                    });
                    return defer.promise;
                })
                .then((res) => {
                    if (exit) this.exit();
                    this.appCommon.toast('Successfully saved!');
                });
		}

        confirmClearFrame(){
            this.appCommon.confirm("Clear all graphics in this frame?").then(() => this.grafika.clearFrame());
        }

        confirmDeleteGraphics(){
            this.appCommon.confirm("Delete this graphic?").then(() => this.grafika.deleteSelectedGraphics());
        }

        confirmDeleteFrame(){
            this.appCommon.confirm("Delete this frame?").then(() => this.grafika.exts.deleteFrame());
        }

        confirmExit() {
            if (this.grafika.isModified()) 
                this.appCommon.confirm('Close?').then(() => this.exit());
            else this.exit();
        }

        setOptions(opts: Grafika.IOption) {
            this.grafika.setOptions(opts);
            this.update();
        }

        exit() {
            this.appCommon.$state.go('my-animations');
        }

        update() {
            let wrapper = $("#canvas-wrapper");
            wrapper.removeClass("none").removeClass("paint").removeClass("select").removeClass("move").removeClass("delete")
                    .addClass(this.grafika.getOptions().drawingMode);
            if (this.grafika.getSelectedGraphics().length > 0)
                wrapper.addClass("move");
            else wrapper.removeClass("move");
        }

        ////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

        addResource(imageData: ImageData) {
            let resource: Grafika.IBackgroundImageResource = {
                id : Grafika.randomUid("res-"),
                type : "background-image",
                mime : imageData.mime
            };
            let currentFrameNumber = this.grafika.getFrame().index;

            return this.resourceService.saveResource(this.animation, resource)
                    .then((res) => this.resourceService.upload(res.data, { mime: res.data.mime, blob: imageData.blob() }))
                    .then((res) => {
                        resource.url = this.resourceService.getResourceUrl(this.animation, resource);
                        this.grafika.addResource(resource);
                    })
                    .then(() => this.animationService.update(this.animation))
                    .then(() => {
                        this.grafika.navigateToFrame(currentFrameNumber);
                        this.grafika.setFrameBackground(resource.id);
                        this.animation = this.grafika.getAnimation();
                    });
        }

        existingResources(evt: MouseEvent){
            return this.appCommon.showDialog("/app/animation/resources/list.html", "ResourceListController", evt, { resources: this.animation.resources, grafika: this.grafika }, "vm", true)
                .then((resource) => {
                    if (resource)
                        this.grafika.setFrameBackground(resource.id);
                });
        }

        ////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

        copyGraphics(){
            this.grafika.copySelectedGraphics();
            this.appCommon.toast("Graphics copied");
        }

        cutGraphics(){
            this.grafika.copySelectedGraphics();
            this.grafika.deleteSelectedGraphics();
            this.appCommon.toast("Graphics cut");
        }

        pasteGraphics(){
            this.grafika.pasteSelectedGraphics();
            this.appCommon.toast("Graphics pasted");
        }

        ////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

        private captureContextMenu(event: JQueryMouseEventObject) {
            if (!this.canvas) return;
			this.canvas.attr('context-menu-x', event.offsetX).attr('context-menu-y', event.offsetY);
        }

        private createFirstFrame(): Grafika.IFrame[] {
            return [{
                id: Grafika.randomUid(),
                index: 0,
                backgroundColor: "#ffffff",
                foregroundColor: "#000000",
                backgroundResourceId: undefined,
                type: "frames",
                modified: false,
                layers: [
                    {
                        id: Grafika.randomUid(),
                        index: 0,
                        graphics: [],
                        type: "layer"
                    }
                ]
            }];
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
    
    ////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

    class GraphicController extends FrameController {
        protected graphics: Grafika.IGraphic[];

        constructor(appCommon: AppCommon, grafika: Grafika.IGrafika | any) {
            super(appCommon, grafika);
            this.graphics = this.frame.layers[0].graphics
        }    

        stringify(obj: any){
            return JSON.stringify(obj);
        }    

    }
}