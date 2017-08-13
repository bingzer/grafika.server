module GrafikaApp {
    export module Drawing {
        export module Controllers {
            export class DrawingController extends BaseAnimationController implements Grafika.ICallback {
                grafikaReady: boolean = false;
                grafika: Grafika.IGrafika = new Grafika();
                currentFrame: number = 1;
                totalFrame: number = 0;
                canvas: JQuery;
                graphics = ['freeform', 'line', 'rectangle', 'square', 'circle', 'oval', 'triangle', 'text'];
                supportsResources: boolean = true;
                selectedBackgroundColor: string;
                selectedForegroundColor: string;
                selectedBackgroundColorText: string;
                selectedForegroundColorText: string;

                public static $inject = ['appCommon', 'authService', 'animationService', 'frameService', 'resourceService', '$rootScope', '$scope'];
                constructor(
                    appCommon: AppCommon,
                    authService: Services.AuthService,
                    protected animationService: Services.AnimationService,
                    protected frameService: Services.FrameService,
                    protected resourceService: Services.ResourceService,
                    protected $rootScope: angular.IRootScopeService,
                    protected $scope: angular.IScope
                ) {
                    super(appCommon, authService, animationService, frameService, resourceService, false);
                    this.grafika.setCallback(this);

                    window['grafika'] = this.grafika;

                    $scope.$watch("vm.selectedBackgroundColor", (newValue: string, oldValue) => {
                        this.selectedBackgroundColorText = newValue;
                        this.setOptions({ backgroundColor: newValue } as Grafika.IOption);
                    });
                    $scope.$watch("vm.selectedForegroundColor", (newValue: string, oldValue) => {
                        this.selectedForegroundColorText = newValue;
                        this.setOptions({ foregroundColor: newValue } as Grafika.IOption);
                    });
                }

                on(eventName: string, obj: any) {
                    switch (eventName) {
                        case Grafika.EVT_FRAME_CHANGED:
                            this.currentFrame = (<number>obj) + 1;
                            $('#currentFrame').val(this.currentFrame);
                            this.selectedBackgroundColor = this.grafika.frame.backgroundColor;
                            this.selectedForegroundColor = this.grafika.frame.foregroundColor;
                            break;
                        case Grafika.EVT_FRAME_COUNT:
                            this.totalFrame = <number>obj;
                            break;
                        case Grafika.EVT_GRAPHIC_SELECTED:
                            this.update();
                            break;
                    }
                }

                load(animationId?: string) {
                    super.load(GrafikaApp.Drawing.animationId);
                }

                onLoaded(animation: Grafika.IAnimation): ng.IPromise<any> {
                    this.canvas = this.appCommon.elem('#canvas').contextmenu(this.captureContextMenu);
                    this.appCommon.elem('#canvas-container').css('max-width', this.animation.width).css('max-height', this.animation.height);

                    return this.frameService.get(this.animation).then((res) => {
                        this.grafika.initialize('#canvas', { drawingMode: 'paint', useNavigationText: false }, this.animation);
                        this.grafika.setFrames(res.data);
                        return this.appCommon.$q.when(this.animation);
                    }).catch((err) => {
                        if (!this.animation.width) {
                            this.animation.width = 800;
                            this.animation.height = 400;
                        }
                        // most likely this is a new animation
                        this.grafika.initialize('#canvas', { drawingMode: 'paint', useNavigationText: false }, this.animation);
                        this.grafika.setFrames(this.createFirstFrames());
                        return this.appCommon.$q.when(this.animation);
                    }).finally(() => {
                        this.appCommon.hideLoadingModal();
                        this.grafikaReady = true;
                    });
                }

                showProperties(ev: MouseEvent) {
                    let controller = new AnimationController(this.appCommon, this.grafika);
                    return this.appCommon.showDialog('/js/drawing/drawing-animation.html', () => controller, ev);
                }

                showFrameProperties(ev: MouseEvent) {
                    let controller = new FrameController(this.appCommon, this.grafika);
                    return this.appCommon.showDialog('/js/drawing/drawing-frame.html', () => controller, ev);
                }

                showGraphicsProperties(ev: MouseEvent) {
                    let controller = new GraphicController(this.appCommon, this.grafika);
                    return this.appCommon.showDialog('/js/drawing/drawing-graphics.html', () => controller, ev)
                        .then(() => this.grafika.refreshFrame());
                }

                save(exit: boolean) {
                    this.grafika.save();

                    let animation = this.grafika.getAnimation();
                    this.animationService.update(animation)
                        .then((res) => this.frameService.update(animation, this.grafika.getFrames()))
                        .then((res) => this.resourceService.saveThumbnail(animation))
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
                            this.grafika.save();
                            this.appCommon.toast('Successfully saved!');
                        });
                }

                confirmClearFrame() {
                    this.appCommon.confirm("Clear all graphics in this frame?").then(() => this.grafika.clearFrame());
                }

                confirmDeleteGraphics() {
                    this.appCommon.confirm("Delete this graphic?").then(() => this.grafika.deleteSelectedGraphics());
                }

                confirmDeleteFrame() {
                    this.appCommon.confirm("Delete this frame?").then(() => this.grafika.exts.deleteFrame());
                }

                confirmExit() {
                    if (this.grafika.isModified())
                        this.appCommon.confirm('Close?').then(() => this.exit());
                    else this.exit();
                }

                setOptions(opts: Grafika.IOption) {
                    if (this.grafikaReady) {
                        this.grafika.setOptions(opts);
                        this.update();
                    }
                }

                exit() {
                    this.grafika.save();
                    GrafikaApp.navigateTo('/');
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

                addResource(imageData: Models.IImageData) {
                    let resource: Grafika.IBackgroundImageResource = {
                        id: Grafika.randomUid("res-"),
                        type: "background-image",
                        mime: imageData.mime
                    };
                    let currentFrameNumber = this.grafika.getFrame().index;

                    return this.resourceService.saveResource(this.animation, resource)
                        .then((res) => this.resourceService.upload(res.data, { mime: res.data.mime, blob: imageData.getBlob() }))
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

                existingResources(evt: MouseEvent) {
                    let controller = new ResourceListController(this.appCommon, this.resourceService, this.animation.resources, this.grafika);
                    return this.appCommon.showDialog("/js/drawing/drawing-resources.html", () => controller, evt, { resources: this.animation.resources, grafika: this.grafika }, "vm", true)
                        .then((resource) => {
                            if (resource)
                                this.grafika.setFrameBackground(resource.id);
                        });
                }

                ////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

                copyGraphics() {
                    this.grafika.copySelectedGraphics();
                    this.appCommon.toast("Graphics copied");
                }

                cutGraphics() {
                    this.grafika.copySelectedGraphics();
                    this.grafika.deleteSelectedGraphics();
                    this.appCommon.toast("Graphics cut");
                }

                pasteGraphics() {
                    this.grafika.pasteSelectedGraphics();
                    this.appCommon.toast("Graphics pasted");
                }

                ////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

                protected createFirstFrames(): Grafika.IFrame[] {
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

                ////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

                private captureContextMenu(event: JQueryMouseEventObject) {
                    if (!this.canvas) return;
                    this.canvas.attr('context-menu-x', event.offsetX).attr('context-menu-y', event.offsetY);
                }
            }

            ////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

            class AnimationController extends DialogController {
                protected animation: Grafika.IAnimation;

                constructor(appCommon: AppCommon, protected grafika: Grafika.IGrafika) {
                    super(appCommon);

                    this.animation = this.grafika.getAnimation();
                }

                close(response?: any): ng.IPromise<any> {
                    this.grafika.refreshFrame();
                    return super.close();
                }
            }

            ////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

            class FrameController extends DialogController {
                protected frame: Grafika.IFrame;

                constructor(appCommon: AppCommon, protected grafika: Grafika.IGrafika) {
                    super(appCommon);
                    this.frame = this.grafika.getFrame();
                }

                close(response?: any): ng.IPromise<any> {
                    this.grafika.refreshFrame();
                    return super.close();
                }
            }

            ////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

            class GraphicController extends FrameController {
                protected graphics: Grafika.IGraphic[];

                constructor(appCommon: AppCommon, grafika: Grafika.IGrafika) {
                    super(appCommon, grafika);
                    this.graphics = this.frame.layers[0].graphics
                }

                stringify(obj: any) {
                    return JSON.stringify(obj);
                }

            }

            ////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

            export class ResourceListController extends DialogController {
                public static $inject = ['appCommon', 'resourceService', 'resources', 'grafika'];
                constructor(
                    appCommon: AppCommon,
                    private resourceService: GrafikaApp.Drawing.Services.ResourceService,
                    private resources: Grafika.IResource[],
                    private grafika: Grafika.IGrafika
                ) {
                    super(appCommon);
                    this.list();
                }

                list() {
                    if (!this.resources || this.resources.length <= 0) {
                        this.appCommon.toastError('No resources available');
                        this.close();
                    }
                }

                select(resourceId: string) {
                    let resource = this.resources.filter(r => r.id == resourceId)[0];
                    this.close(resource);
                }

                deleteResource(resourceId) {
                    this.resourceService.del(this.grafika.getAnimation(), resourceId).then(() => {
                        this.grafika.deleteResource(resourceId);
                        this.resources = this.grafika.getResources();
                        this.list();
                    });
                }
            }


        }
    }
}