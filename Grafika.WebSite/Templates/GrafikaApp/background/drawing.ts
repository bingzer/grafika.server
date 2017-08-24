module GrafikaApp {
    export class BackgroundDrawingController extends BaseBackgroundController implements Grafika.ICallback {
        grafika: Grafika.IGrafika = new Grafika();
        totalFrame: number = 0;
        canvas: JQuery;
        grafikaReady: boolean = false;
        graphics = ['freeform', 'line', 'rectangle', 'square', 'circle', 'oval', 'triangle', 'text'];
        
        public static $inject = ['appCommon', 'authService', 'uxService', 'backgroundService', 'resourceService', '$rootScope'];
        constructor(
            appCommon: AppCommon, 
            authService: AuthService,
            private uxService: UxService,
            protected backgroundService: BackgroundService,
            protected resourceService: ResourceService,
            $rootScope: angular.IRootScopeService
        ){
            super(appCommon, authService, backgroundService, resourceService, false);
            this.grafika.setCallback(this);

            window['grafika'] = this.grafika;
        }

        on(eventName: string, obj: any) {
            // do nothing
        } 

        onLoaded(background: Grafika.IBackground): ng.IPromise<any> {
            this.uxService.pageTitle = 'Edit ' + this.background.name;
            this.canvas = this.appCommon.elem('#canvas').contextmenu(this.captureContextMenu);
            this.appCommon.elem('#canvas-container').css('max-width', this.background.width).css('max-height', this.background.height);

            return this.backgroundService.getFrames(this.background).then((res) => {
                this.grafika.initialize('#canvas', { drawingMode: 'paint', useNavigationText: false }, this.background as Grafika.IAnimation);
                this.grafika.setFrames(res.data);
                this.grafikaReady = true;
                return this.appCommon.$q.when(this.background);
            }).catch((err) => {
                // most likely this is a new background
                this.grafika.initialize('#canvas', { drawingMode: 'paint', useNavigationText: false }, this.background as Grafika.IAnimation);
                this.grafika.setFrames(this.createFirstFrame());
                this.grafikaReady = true;
                return this.appCommon.$q.when(this.background);
            }).finally(() => {
                this.appCommon.hideLoadingModal();
            });
        }

        showProperties(ev: MouseEvent) {
            return this.appCommon.showDialog('/app/background/edit.html', 'BackgroundEditController', ev).then(() => this.load());
        }

        showFrameProperties(ev: MouseEvent) {
            let controller = new FrameController(this.appCommon, this.grafika);
            return this.appCommon.showDialog('/app/background/drawing-frame.html', () => controller, ev);
        }

        showGraphicsProperties(ev: MouseEvent) {
            let controller = new GraphicController(this.appCommon, this.grafika);
            return this.appCommon.showDialog('/app/background/drawing-graphics.html', () => controller, ev)
                        .then(() => this.grafika.refreshFrame());
        }

		save(exit: boolean) {
			this.grafika.save();

            let background = this.grafika.getAnimation() as Grafika.IBackground;
            background.type = "background";
			this.backgroundService.update(background)
                .then((res) => this.backgroundService.updateFrames(background, this.grafika.getFrames()))
                .then((res) => this.resourceService.saveThumbnail(background) )
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

            return this.resourceService.saveResource(this.background, resource)
                    .then((res) => this.resourceService.upload(res.data, { mime: res.data.mime, blob: imageData.blob() }))
                    .then((res) => {
                        resource.url = this.resourceService.getResourceUrl(this.background, resource);
                        this.grafika.addResource(resource);
                    })
                    .then(() => this.backgroundService.update(this.background))
                    .then(() => {
                        this.grafika.navigateToFrame(currentFrameNumber);
                        this.grafika.setFrameBackground(resource.id);
                        this.background = this.grafika.getAnimation();
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