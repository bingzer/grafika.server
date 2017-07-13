
///////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
/////////////////////////////////////////// @GRAFIKA  /////////////////////////////////////////////////////////////////////
///////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

class Grafika implements Grafika.IGrafika {
    version: string = Grafika.VERSION;
    animation: Grafika.IAnimation = <Grafika.IAnimation> {};
    frames: Grafika.IFrame[] = [];
    frame: Grafika.IFrame;
    selectedGraphics: Grafika.IGraphic[] = [];
    copiedSelectedGraphics: Grafika.IGraphic[] = [];
    renderers: Grafika.IRenderer<Grafika.IDrawable>[] = [];
    callback: Grafika.ICallback = new Grafika.DefaultCallback(this);
    contextBackground: CanvasRenderingContext2D;
    context: CanvasRenderingContext2D;
    contextDrawing: CanvasRenderingContext2D;

    private currentGraphic: Grafika.IGraphic;
    private isPainting: boolean = false;
    private isMovingGraphics: boolean = false;
    private animator: number = undefined;
    private options: Grafika.IOption = new Grafika.DefaultOption();
    private canvasWrapper: HTMLDivElement;
    private lastX: number;
    private lastY: number;
    private plugins: Grafika.IPlugin[] = [];
    private animRenderer: Grafika.IAnimationRenderer;
    private frameRenderer: Grafika.IFrameRenderer;
    private layerRenderer: Grafika.ILayerRenderer;
    private defaultRenderer: Grafika.IRenderer<Grafika.IDrawable>;
    private scale: Grafika.IScale = { x: 1, y: 1 };
    private commando: Grafika.ICommandManager = new Grafika.CommandManager(this);

    private graphicBeforeMoving: Grafika.IGraphic;
    
    initialize = (canvasId: string, opts?: Grafika.IOption, anim?: Grafika.IAnimation) => {
		Grafika.log(this, "-------- v" + this.version + " --------");

		//this.log('Grafika v.' + api.version);
		this.validateCanvas(canvasId);
        // registers default renderers
        this.registerRenderer(new Grafika.BackgroundLayerRenderer(this));
        this.registerRenderer(new Grafika.BackgroundColorRenderer(this));
        this.registerRenderer(new Grafika.BackgroundImageRenderer(this));
        this.registerRenderer(new Grafika.RectangleRenderer(this));
        this.registerRenderer(new Grafika.SquareRenderer(this));
        this.registerRenderer(new Grafika.CircleRenderer(this));
        this.registerRenderer(new Grafika.OvalRenderer(this));
        this.registerRenderer(new Grafika.FreeformRenderer(this));
        this.registerRenderer(new Grafika.TriangleRenderer(this));
        this.registerRenderer(new Grafika.LineRenderer(this));
        this.registerRenderer(new Grafika.TextRenderer(this));
        this.registerRenderer(this.layerRenderer = new Grafika.LayerRenderer(this));
        this.registerRenderer(this.frameRenderer = new Grafika.FrameRenderer(this));
        this.registerRenderer(this.animRenderer = new Grafika.AnimationRenderer(this));
        this.registerRenderer(this.defaultRenderer = new Grafika.DefaultRenderer(this));

		this.setAnimation(anim);	
		this.setOptions(opts);
		
		// grab plugins
		if (Grafika.Plugins){
			Grafika.Plugins.forEach((func) => {
				let plugin = func(this);
				Grafika.log(this, `Plugin: ${plugin.name} v. ${plugin.version}`);
				this.plugins.push(plugin);
			});
		}
	
		Grafika.log(this, `Grafika v.${this.version} [initialized]`);

		this.callback.on(Grafika.EVT_INITIALIZED);	
    }

    destroy = () => {
        this.selectedGraphics = [];
        if (this.isPlaying()) 
            this.pause();
        this.setAnimation(this.animRenderer.create());
        this.frame = this.frameRenderer.create();
        this.frames = [this.frame];
        this.commando.clearActions();
        this.clearFrame();
        this.callback.on(Grafika.EVT_DESTROYED);
    }

    getAnimation = () => this.animation;
    setAnimation = (anim: Grafika.IAnimation) => {
		this.animation = this.animRenderer.create(anim);

        if (!this.animation.name) throw new Error('Animation name is required');
        if (!this.animation.width || !this.animation.height) throw new Error('Animation width + height is required');
		Grafika.log(this, 'Animation (' + this.animation.localId + ')' +
			' name: ' + this.animation.name +
			', timer: ' + this.animation.timer + 
			', size: ' + this.animation.width + ' x ' + this.animation.height);

        // scaling
        this.scale.x = this.animation.width / ( this.context.canvas.width || this.animation.width );
        this.scale.y = this.animation.height / ( this.context.canvas.height || this.animation.height);
        this.context.scale(this.scale.x, this.scale.y);
        this.contextDrawing.scale(this.scale.x, this.scale.y);
        this.contextBackground.scale(this.scale.x, this.scale.y);
			
        this.context.canvas.setAttribute('width', "" + this.animation.width);
        this.context.canvas.setAttribute('height', "" + this.animation.height);
        this.contextBackground.canvas.setAttribute('width', "" + this.animation.width);
        this.contextBackground.canvas.setAttribute('height', "" + this.animation.height);
        this.contextDrawing.canvas.setAttribute('width', "" + this.animation.width);
        this.contextDrawing.canvas.setAttribute('height', "" + this.animation.height);
		this.setFrames(this.frames);
    }
    saveAnimation = (anim?: Grafika.IAnimation) => {
        if (anim) {
            this.animation = this.animRenderer.create(anim);
        }
	    this.animation.totalFrame = this.frames.length;
		this.animation.modified = false;
		this.animation.dateModified = Date.now();
		this.animation.client = {
            version: this.version,
            browser: navigator.userAgent
		};
		this.callback.on(Grafika.EVT_ANIMATION_SAVED)
    }
    play = () => {
        if (this.animator)  return; // already animating
        if (!this.animation.timer) 
            this.animation.timer = 500;
		
        Grafika.log(this, `Animation started. Timer: ${this.animation.timer} ms`);
        
        let start;
        let that = this;
        function animate(timestamp){
            if (!start) start = timestamp;

            let delta = timestamp - start;
            if (delta > that.animation.timer) {
                start = timestamp;
                // next frame
                if (that.animation.currentFrame >= that.frames.length - 1) {
                    if (that.options.loop) {
                        that.animation.currentFrame = 0;
                        that.navigateTo(that.animation.currentFrame, false);
                    }
                    else
                        return that.pause();
                }
                else {
                    that.navigateTo(that.animation.currentFrame + 1, false);
                }
            }
            that.animator = window.requestAnimationFrame(animate);
        }
        
        this.animator = window.requestAnimationFrame(animate);
		
		this.callback.on(Grafika.EVT_FRAME_COUNT, this.frames.length);
        this.callback.on(Grafika.EVT_PLAYING, true);
        this.navigateToFrame(0);
    }
    pause = () => {
        if (!this.isPlaying()) return;

        window.cancelAnimationFrame(this.animator);
        this.animator = undefined;

        this.callback.on(Grafika.EVT_PLAYING, false);
        Grafika.log(this, 'Animation stopped');
    }
    isPlaying = () => Grafika.isDefined(this.animator);
    isModified = () => {
        if (this.animation.modified) return true;
        if (this.frame.modified) return true;
        return false;
    }
    save = () => {
        this.saveAnimation();
        this.saveFrame();
    }

    getScale = () => this.scale;

    addResource = (resource: Grafika.IResource) => {
        for(let i = 0; i < this.animation.resources.length; i++) {
            if (this.animation.resources[i].id === resource.id)
                return;
        }

        let newResource = this.getResourceRenderer(resource).create(resource);
        this.animation.resources.push(newResource);
    }
    hasResource = (resId: string): boolean => {
        for(let i = 0; i < this.animation.resources.length; i++) {
            if (this.animation.resources[i].id === resId)
                return true;
        }
        return false;
    }
    getResource = (resId: string) => {
        for(let i = 0; i < this.animation.resources.length; i++) {
            if (this.animation.resources[i].id === resId)
                return this.animation.resources[i];
        }
        return null;
    }
    deleteResource = (resId: string) => {
        for(let i = 0; i < this.animation.resources.length; i++) {
            if (this.animation.resources[i].id === resId){
                this.animation.resources.splice(i, 1);
                break;
            }
        }
        for(let i = 0; i < this.frames.length; i++) {
            if (this.frames[i].backgroundResourceId == resId)
                delete this.frames[i].backgroundResourceId;
        }

        this.refreshFrame({ drawBackground: true });
    }
    getResources = () => {
        return this.animation.resources;
    }

    getLayer = () => this.frame.layers[0];
    refreshFrame = (refreshOptions: Grafika.IRefreshFrameOptions = { keepCurrentGraphic: false, keepSelectedGraphics: false, drawBackground: false }) => {
        if (Grafika.isUndefined(refreshOptions.keepCurrentGraphic) || !refreshOptions.keepCurrentGraphic)
            this.currentGraphic = null;
        if (Grafika.isUndefined(refreshOptions.keepSelectedGraphics) || !refreshOptions.keepSelectedGraphics)
            this.selectedGraphics = [];

        if (refreshOptions.drawBackground)
            this.frameRenderer.drawBackground(this.contextBackground, this.frame);
            
        Grafika.clearCanvas(this.context);
        this.frameRenderer.draw(this.context, this.frame);
    }
    getFrame = () => this.frame;
    getFrames = () => this.frames;
    clearFrame = () => {
		this.frame = this.frameRenderer.create();
        this.commando.clearActions();
		this.refreshFrame();
    }
    setFrames = (frames: Grafika.IFrame[]) => {
        if (Grafika.isUndefined(frames) || frames.length == 0)
            frames = [this.frameRenderer.create()];

        this.frames = frames;
        this.animation.totalFrame = this.frames.length;
		this.frame = this.frames[0];
		this.navigateToFrame(0);
		this.callback.on(Grafika.EVT_FRAME_COUNT, this.animation.totalFrame);
    }
    saveFrame = () => {
        this.frame.modified = false;
        this.frames[this.animation.currentFrame] = this.frame;
        this.callback.on(Grafika.EVT_FRAME_SAVED, this.animation.currentFrame);
    }
    setFrameBackground = (resource: Grafika.IResource | Grafika.IBackgroundColorResource | string) => {
        if (Grafika.isUndefined(resource)) return;
        if (typeof(resource) === "string" || (<Grafika.IResource> resource).id) {
            let resId = (<Grafika.IResource> resource).id || resource;
            if (!this.hasResource(resId) && typeof(resource) !== "string")
                this.addResource(<Grafika.IResource>resource);
            if (this.hasResource(resId))
                this.frame.backgroundResourceId = resId;
            else throw new Error(`'${resId}' is not a resource`);
        }
        else if ((resource as Grafika.IBackgroundColorResource).backgroundColor)
            this.frame.backgroundColor = (resource as Grafika.IBackgroundColorResource).backgroundColor;

        this.refreshFrame({ drawBackground: true });
    }
    nextFrame = () => this.navigateToFrame(this.animation.currentFrame + 1);
    previousFrame = () => this.navigateToFrame(this.animation.currentFrame - 1);
    navigateToFrame = (index: number) => this.navigateTo(index, true);

    findSelectedGraphics = (x: number, y: number) => {
        let g: Grafika.IGraphic;
        this.selectedGraphics = [];
        for (let i = 0; i < this.frame.layers.length; i++){
            let layer = this.frame.layers[i];
            for (let j = 0; j < layer.graphics.length; j++){
                g = layer.graphics[j];
                if (this.getGraphicRenderer(g).contains(g, x, y)){
                    this.selectedGraphics.push(g);
                }
            }
        }

        // if there's more than one
        // find the closest to the touch coordinate
        // this only works if we support one selected graphic which we are currently supportin gright now
        if (this.selectedGraphics.length > 1) {
            // find the best one
            let closest: Grafika.IGraphic = this.selectedGraphics[0];
            let longestSide = Grafika.calculateFurthestDistance(x, y, closest);
            for (let i = 1; i < this.selectedGraphics.length; i++) {
                if (Grafika.calculateFurthestDistance(x, y, this.selectedGraphics[i]) < longestSide)
                    closest = this.selectedGraphics[i]; 
            }

            return this.selectedGraphics = [closest];
        }
		
        return this.selectedGraphics;
    }
    findGraphic = (id: string| Grafika.IGraphic) => {
        let graphicId = id && (<Grafika.IGraphic> id).id || <string>id;
        let layer = this.getLayer();
        for (let i = 0; i < layer.graphics.length; i++) {
            if (layer.graphics[i].id == graphicId)
                return layer.graphics[i];
        }

        return null;
    }
    selectGraphic = (id: string| Grafika.IGraphic) => {
        let graphicId = id && (<Grafika.IGraphic> id).id || <string>id;
        let graphic = this.findGraphic(graphicId);
        if (graphic) {
            this.selectedGraphics = [graphic];
            this.refreshFrame({ keepSelectedGraphics: true });
        }

        return graphic;
    }
    deleteGraphic = (id: string | Grafika.IGraphic, actionable: boolean = true) => {
        let graphic = this.selectGraphic(id);
        this.deleteSelectedGraphics(actionable);

        return graphic;
    }

    getSelectedGraphics = () => this.selectedGraphics;

    deleteSelectedGraphics = (actionable: boolean = true) => {
        this.frame.modified = true;
        let temp = [];
		let graphics = this.getLayer().graphics;
        for(let i = 0; i < graphics.length; i++){
            let found = false;
            for (let j = 0; j < this.selectedGraphics.length; j++){
                if (graphics[i].id == this.selectedGraphics[j].id){
                    found = true;
                    if (found) break;
                }
            }
            
            if (!found) temp.push(graphics[i]);
        }
        this.getLayer().graphics = temp;
        if (actionable && Grafika.isDefined(this.selectedGraphics[0])) {
            this.callback.on(Grafika.EVT_GRAPHIC_DELETED);
            this.commando.addAction(new Grafika.GraphicDeleted(this, this.selectedGraphics[0]));
        }

        this.refreshFrame();
    }
    copySelectedGraphics = () => {
        if (!this.selectedGraphics) return;

        this.copiedSelectedGraphics = Grafika.clone(this.selectedGraphics);
        // changed ids
        for (let i = 0; i < this.copiedSelectedGraphics.length; i++) {
            this.copiedSelectedGraphics[i].id = Grafika.randomUid();
        }
        
        this.callback.on(Grafika.EVT_GRAPHIC_COPIED);
    }
    pasteSelectedGraphics = () => {
        if (!this.copiedSelectedGraphics) return;

        this.selectedGraphics = Grafika.clone(this.copiedSelectedGraphics);
        // changed ids of selected graphics
        for (let i = 0; i < this.selectedGraphics.length; i++) {
            this.selectedGraphics[i].id = Grafika.randomUid();
        }

        this.setOptions({ drawingMode: Grafika.MODE_SELECT });
        this.getLayer().graphics = this.getLayer().graphics.concat(this.selectedGraphics);
        this.refreshFrame({ keepSelectedGraphics: true });

        this.callback.on(Grafika.EVT_GRAPHIC_PASTED);
        this.commando.addAction(new Grafika.GraphicPasted(this, this.selectedGraphics[0]));
    }

    getCurrentGraphic = () => this.currentGraphic;

    getOptions = () => this.options;

    getCanvas = () => this.context.canvas;
    getCanvasContext = () => this.context;

    setCallback = (callback: Grafika.ICallback) => {
        if (Grafika.isUndefined(callback)) throw new Error('callback cannot be undefined');
        this.callback = callback;
    }

    setOptions = (opts: Grafika.IOption) => {
        if (!opts) return;
        let shouldRefreshFrame = false;
        let drawBackground = false;
        if (opts.backgroundColor) {
            this.options.backgroundColor = opts.backgroundColor;
            this.frame.backgroundColor = this.options.backgroundColor;
			this.frame.modified = true;
            shouldRefreshFrame = true;
            drawBackground = true;
        }
        if (opts.foregroundColor) {
            this.options.foregroundColor = opts.foregroundColor;
            this.frame.foregroundColor = this.options.foregroundColor;
            shouldRefreshFrame = true;
        }
        if (opts.brushSize) this.options.brushSize = opts.brushSize;
        if (opts.graphic) {
            this.options.graphic = opts.graphic;
            shouldRefreshFrame = true;
        }
        if (Grafika.isDefined(opts.graphicFill) && opts.graphicFill != null) {
            this.options.graphicFill = opts.graphicFill;
            shouldRefreshFrame = true;
        }
        if (Grafika.isDefined(opts.useCarbonCopy) && opts.useCarbonCopy != null) {
            this.options.useCarbonCopy = opts.useCarbonCopy;
            shouldRefreshFrame = true;
        }
        if (Grafika.isDefined(opts.useNavigationText) && opts.useNavigationText != null) {
            this.options.useNavigationText = opts.useNavigationText;
            shouldRefreshFrame = true;
        }
        if (Grafika.isDefined(opts.navigationTextX) && opts.navigationTextX != null) {
            this.options.navigationTextX = opts.navigationTextX;
            shouldRefreshFrame = true;
        }
        if (Grafika.isDefined(opts.navigationTextY) && opts.navigationTextY != null) {
            this.options.navigationTextY = opts.navigationTextY;
            shouldRefreshFrame = true;
        }
		if (Grafika.isDefined(opts.loop) && opts.loop != null) {
			this.options.loop = opts.loop;
		}
        if (opts.drawingMode){
            let mode = opts.drawingMode.toLowerCase();
            if (mode != Grafika.MODE_NONE && mode != Grafika.MODE_PAINT && mode != Grafika.MODE_SELECT)
                throw new Error('Drawing mode is not supported: ' + mode);
            this.options.drawingMode = mode;
            if (this.options.drawingMode == Grafika.MODE_PAINT || this.options.drawingMode == Grafika.MODE_NONE)
            shouldRefreshFrame = true;
        }
        if (Grafika.isDefined(opts.debugMode) && opts.debugMode != null){
            this.options.debugMode = opts.debugMode;
        }
        if (shouldRefreshFrame) 
            this.refreshFrame({ drawBackground: drawBackground });
    }

    registerRenderer = <TDrawable extends Grafika.IDrawable>(renderer: Grafika.IRenderer<TDrawable>): Grafika.IRenderer<TDrawable> => {
        this.renderers.push(renderer);
        return renderer;
    }
    getRenderer = <TRenderer extends Grafika.IRenderer<TDrawable>, TDrawable extends Grafika.IDrawable>(drawableOrType: TDrawable | Grafika.IDrawable | string) => {
        for(let i = 0; i < this.renderers.length; i++){
            if (this.renderers[i].canRender(drawableOrType))
                return <TRenderer> this.renderers[i];
        }
        return <TRenderer> this.defaultRenderer;
    }
    getResourceRenderer = <TResource extends Grafika.IResource>(resOrResId: TResource | Grafika.IResource | string): Grafika.IResourceRenderer<TResource> => {
        return this.getRenderer<Grafika.IResourceRenderer<TResource>, TResource>(resOrResId);
    }
    getGraphicRenderer = <TGraphic extends Grafika.IGraphic>(graphicOrType: TGraphic | Grafika.IGraphic | string) => {
        return this.getRenderer<Grafika.IGraphicRenderer<TGraphic>, TGraphic>(graphicOrType);
    }

    canUndo = () => this.commando.canUndo();
    canRedo = () => this.commando.canRedo();
    undo = () => this.commando.undo();
    redo = () => this.commando.redo();

    getName = () => "[Grafika " + this.version + "]";
    isLogEnabled = () => this.options.debugMode;

    //////////////////////////////////////////

    private validateCanvas(canvasId): HTMLCanvasElement {
        if (!canvasId) throw new Error('canvasId is required');
        let canvas = <HTMLCanvasElement> (document.querySelector(canvasId) || document.getElementById(canvasId));

        if (!canvas) throw new Error('No element found for ' + canvasId + '.');
        canvas.width = 0;
        canvas.height = 0;
        canvas.style.zIndex = "0";
        canvas.style.width = "100%";
        canvas.style.height = "100%";        
        canvas.style.position = "absolute";
        canvas.style.left = "0px";

        let canvasBackground = document.createElement('canvas');
        canvasBackground.id = canvas.id + '-background';
        canvasBackground.style.zIndex = "-10";
        canvasBackground.style.width = "100%";
        canvasBackground.style.height = "100%";        
        canvasBackground.style.position = "absolute";
        canvasBackground.style.left = "0px";

        let canvasDrawing = document.createElement('canvas');
        canvasDrawing.id = canvas.id + '-drawing';
        canvasDrawing.style.zIndex = "10";
        canvasDrawing.style.width = "100%";
        canvasDrawing.style.height = "100%";
        canvasDrawing.style.left = "0px";
        canvasDrawing.addEventListener('mousedown', (e) => this.onMouseDown(e));
        canvasDrawing.addEventListener('touchstart', (e) => this.onMouseDown(e));        
        canvasDrawing.addEventListener('mousemove', (e) => this.onMouseMove(e));
        canvasDrawing.addEventListener('touchmove', (e) => this.onMouseMove(e));        
        canvasDrawing.addEventListener('mouseup', (e) => this.onMouseUp(e));
        canvasDrawing.addEventListener('touchend', (e) => this.onMouseUp(e));        
        canvasDrawing.addEventListener('mouseleave', (e) => this.onMouseUp(e));
        canvasDrawing.addEventListener('touchleave', (e) => this.onMouseUp(e));
		
        this.context = canvas.getContext('2d');
        this.context.lineJoin = "round";
        this.context.lineCap = "round";
        this.contextBackground = canvasBackground.getContext('2d');
        this.contextBackground.lineJoin = "round";
        this.contextBackground.lineCap = "round";
        this.contextDrawing = canvasDrawing.getContext('2d');
        this.contextDrawing.lineJoin = "round";
        this.contextDrawing.lineCap = "round";

        if (!this.context.setLineDash)
            this.context.setLineDash = () => { };
        if (!this.contextBackground.setLineDash)
            this.contextBackground.setLineDash = () => { };
        if (!this.contextDrawing.setLineDash)
            this.contextDrawing.setLineDash = () => { };

        let oldParent = this.context.canvas.parentElement;

        this.canvasWrapper = document.createElement('div');
        this.canvasWrapper.id = this.context.canvas.id + "-wrapper";
        this.canvasWrapper.style.position = "relative";
        this.canvasWrapper.style.display = "flex";

        canvas.parentElement.removeChild(canvas);

        // position matters
        this.canvasWrapper.appendChild(canvasBackground);
        this.canvasWrapper.appendChild(canvas);
        this.canvasWrapper.appendChild(canvasDrawing);

        oldParent.appendChild(this.canvasWrapper);
        
        return canvas;
    }

    private navigateTo(idx: number, save: boolean) {
        if (idx <= 0) idx = 0;
        
        // save current frames
        if (save) this.saveFrame();
        this.animation.currentFrame = idx;
        
        this.frame = this.frames[this.animation.currentFrame];
        if (!this.frame){
            this.frame = this.frameRenderer.create();
        }
        if (save && this.frame.modified) 
            this.saveFrame();

        this.refreshFrame({ drawBackground: true });       
        this.callback.on(Grafika.EVT_FRAME_CHANGED, this.animation.currentFrame);
        this.callback.on(Grafika.EVT_FRAME_COUNT, this.frames.length);
        this.commando.clearActions();
    }

    private onMouseDown(e: MouseEvent|TouchEvent|any) {
        if (!e || this.isPlaying()) return;
        if( navigator.userAgent.match(/Android/i) ) {
            e.preventDefault();
        }
        
        if (e.type === 'mousedown' && e.which != 1) return; // left click only
        if (this.isPlaying()) return;
        
        let point = Grafika.calculateCoordinates(this.scale, e);

        if (this.options.drawingMode == Grafika.MODE_SELECT){
            let newSelectedGraphics = this.findSelectedGraphics(point.x, point.y);
            if (newSelectedGraphics.length > 0) {
                this.isMovingGraphics = true;
                this.selectedGraphics = newSelectedGraphics;
                this.refreshFrame({ keepSelectedGraphics: true });
                this.callback.on(Grafika.EVT_GRAPHIC_SELECTED, this.selectedGraphics[0].id);
                this.graphicBeforeMoving = Grafika.clone(this.selectedGraphics[0]);
                return;
            } else {
                this.isMovingGraphics = false;
                this.selectedGraphics = [];
                this.options.drawingMode = Grafika.MODE_PAINT;
                this.refreshFrame({ keepSelectedGraphics: true });
                this.callback.on(Grafika.EVT_GRAPHIC_SELECTED, undefined);
            }
        }

        if (this.options.drawingMode != Grafika.MODE_PAINT) return;
        this.isPainting = this.options.drawingMode == Grafika.MODE_PAINT;

        // painting
        let renderer = this.getGraphicRenderer(this.options.graphic);
        this.currentGraphic = renderer.create();
        this.currentGraphic.isFilled = this.options.graphicFill;
        this.currentGraphic.x = point.x;
        this.currentGraphic.y = point.y;
        this.currentGraphic.brushSize = this.options.brushSize;
        this.currentGraphic.backgroundColor = this.options.backgroundColor;
        this.currentGraphic.foregroundColor = this.options.foregroundColor;
        
        renderer.invoke(this.context, this.currentGraphic, "mousedown", point.x, point.y);
        renderer.draw(this.contextDrawing, this.currentGraphic);
    }

    private onMouseMove(e: MouseEvent|TouchEvent|any) {
        if (!e || this.isPlaying()) return;

        let renderer: Grafika.IRenderer<any>;
        let point = Grafika.calculateCoordinates(this.scale, e);

        if (this.isMovingGraphics && this.selectedGraphics.length > 0) {			
			if (!this.lastX) this.lastX = point.x;
			if (!this.lastY) this.lastY = point.y;    
            for (let i = 0; i < this.selectedGraphics.length; i++) {
                this.getGraphicRenderer(this.selectedGraphics[i])
                    .move(this.context, this.selectedGraphics[i], point.x, point.y, this.lastX, this.lastY);
            }
            this.lastX = point.x;
            this.lastY = point.y;
            this.refreshFrame({ keepSelectedGraphics: true });
            return;
        }
        if (this.isPainting && this.currentGraphic) {
            let renderer = this.getGraphicRenderer(this.currentGraphic);
            Grafika.clearCanvas(this.contextDrawing);
            
			renderer.invoke(this.context, this.currentGraphic, 'mousemove', point.x, point.y);
            renderer.draw(this.contextDrawing, this.currentGraphic);
        }
    }

    private onMouseUp(e: MouseEvent|TouchEvent|any) {
        if (!e || this.isPlaying()) return;

        let point = Grafika.calculateCoordinates(this.scale, e);
        Grafika.clearCanvas(this.contextDrawing);
        
        if (this.isPlaying() && e.type == 'mouseup') {
            this.pause();
            return;
        }
        this.frame.modified = true;
        if (this.isMovingGraphics) {
            this.isMovingGraphics = false;
            this.refreshFrame({ keepSelectedGraphics: true });
            
            this.callback.on(Grafika.EVT_FRAME_UPDATED, this.frame.index);
            this.callback.on(Grafika.EVT_GRAPHIC_MOVED, this.selectedGraphics[0].id);
            let lastPoint = {x: this.lastX, y: this.lastY };

            if (this.selectedGraphics[0].x != this.graphicBeforeMoving.x || this.selectedGraphics[0].y != this.graphicBeforeMoving.y) {
                this.commando.addAction(new Grafika.GraphicMoved(this, this.selectedGraphics[0], this.graphicBeforeMoving));
            }
            this.graphicBeforeMoving = undefined;

            this.lastX = null;
            this.lastY = null;
            return;
        }
        if (!this.isPainting) return;
		
        let renderer = this.getGraphicRenderer(this.currentGraphic);

        renderer.invoke(this.context, this.currentGraphic, 'mouseup', point.x, point.y);

        if (this.currentGraphic && renderer.isValid(this.currentGraphic)) {
            this.getLayer().graphics.push(this.currentGraphic);
			this.callback.on(Grafika.EVT_FRAME_UPDATED, this.frame.index);
            this.callback.on(Grafika.EVT_GRAPHIC_CREATED, this.currentGraphic.id);
            this.commando.addAction(new Grafika.GraphicCreated(this, this.currentGraphic));
        }

		this.refreshFrame();
        this.isPainting = false;
    }
} 

///////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
/////////////////////////////////////////// @CONSTANTS ////////////////////////////////////////////////////////////////////
///////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
namespace Grafika {
    export const Plugins:Grafika.IPluginFunction[] = [];
    export const VERSION = '1.0.4';

    export const MODE_NONE = 'none', 
                 MODE_PAINT = 'paint',
                 MODE_SELECT = 'select';
                 
    export const EVT_INITIALIZED = "initialized",
                    EVT_DESTROYED = "destroyed",
                    EVT_PLAYING = "playing",
                    EVT_ANIMATION_SAVED = "animationSaved",
                    EVT_FRAME_COUNT = "frameCount",
                    EVT_FRAME_UPDATED = "frameUpdated",
                    EVT_FRAME_CHANGED = "frameChanged",
                    EVT_FRAME_SAVED = "frameSaved",
                    EVT_GRAPHIC_CREATED = "graphicCreated",
                    EVT_GRAPHIC_SELECTED = "graphicSelected",
                    EVT_GRAPHIC_MOVED = "graphicMoved",
                    EVT_GRAPHIC_COPIED = "graphicCopied",
                    EVT_GRAPHIC_PASTED = "graphicPasted",
                    EVT_GRAPHIC_DELETED = "graphicDeleted";

    export class DefaultOption implements Grafika.IOption {
        backgroundColor = '#ffffff';
        foregroundColor = '#000000';
        brushSize = 5;
        graphic = 'freeform';
        graphicFill = false;
        useCarbonCopy = true;
        useNavigationText = true;
        navigationTextX = 15;
        navigationTextY = 40;
        debugMode = true;
        drawingMode = 'none';
		loop = false;
    }

    export class DefaultCallback implements Grafika.ICallback {
        constructor(private grafika: IGrafika) { /* */ }
        on = (eventName, obj) => Grafika.log(this.grafika, '[callback] ' + eventName, obj);
    }
}

///////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
/////////////////////////////////////////// @RENDERERS ////////////////////////////////////////////////////////////////////
///////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
namespace Grafika {
    export abstract class Renderer<T extends IDrawable> implements IRenderer<T> {
        constructor(protected grafika: IGrafika) {
            if (!grafika) throw new Error("An instance of grafika is required");
        }

        abstract draw(context: CanvasRenderingContext2D, drawable: T);
        abstract create(drawable: T): T;
        abstract getRenderingType(): string;

        canRender(drawable: T | IDrawable | string): boolean {
            return (drawable && (<IDrawable>drawable).type === this.getRenderingType() || drawable === this.getRenderingType());            
        }
    }

    export class DefaultRenderer extends Renderer<Grafika.IDrawable> implements IResourceRenderer<Grafika.IResource>, IRenderer<Grafika.IDrawable> {
        create(drawable: Grafika.IDrawable) {
            return null;
        }
        draw(context: CanvasRenderingContext2D, drawable: Grafika.IDrawable){
            // do nothing
        }
        getRenderingType(): string {
            return null;
        }
        canRender(drawable: Grafika.IDrawable | string): boolean {
            return true;
        }
    }

    export class AnimationRenderer extends Renderer<Grafika.IAnimation> implements IAnimationRenderer {

        create(anim?: Grafika.IAnimation): Grafika.IAnimation{
            if (!anim) 
                anim = <Grafika.IAnimation>{};

            anim._id = anim._id; // maybe undefined if new. Undefined is okay!
            anim.localId = anim.localId || Grafika.randomUid(); // always something
            anim.name = anim.name || anim.localId;
            anim.description = anim.description || anim.description;
            anim.timer = anim.timer || 500;
            anim.width = anim.width || window.innerWidth;
            anim.height = anim.height || window.innerHeight;
            anim.dateCreated = anim.dateCreated || Date.now();
            anim.dateModified = anim.dateModified || anim.dateCreated;
            anim.views = anim.views || 0;
            anim.rating = anim.rating || 0;
            anim.category = anim.category || anim.category;
            anim.isPublic = anim.isPublic || anim.isPublic;
            anim.author = anim.author || anim.author;
            anim.userId = anim.userId || anim.userId;
            anim.thumbnailUrl = anim.thumbnailUrl || anim.thumbnailUrl;
            anim.totalFrame = anim.totalFrame || 0;
            
            anim.currentFrame = anim.currentFrame || 0;
            anim.modified = anim.modified || false;

            anim.resources = anim.resources || [];

            return anim;
        }

        draw(context: CanvasRenderingContext2D, drawable: IAnimation) {
            throw new Error();
        }

        getRenderingType(): string {
            return "animation";
        }
    }

    export class FrameRenderer extends Renderer<Grafika.IFrame> implements IFrameRenderer {
        private backgroundColorRenderer: IResourceRenderer<IBackgroundColorResource>;
        private backgroundImageRenderer: IResourceRenderer<IBackgroundImageResource>;
        private backgroundLayerRenderer: IResourceRenderer<IBackgroundLayerResource>;
        private layerRenderer: ILayerRenderer;

        constructor(grafika: Grafika) {
            super(grafika);
            this.backgroundColorRenderer = this.grafika.getResourceRenderer<IBackgroundColorResource>("background-color");
            this.backgroundImageRenderer = this.grafika.getResourceRenderer<IBackgroundImageResource>("background-image");
            this.backgroundLayerRenderer = this.grafika.getResourceRenderer<IBackgroundLayerResource>("background-layer");
            this.layerRenderer = this.grafika.getRenderer<ILayerRenderer, ILayer>("layer");
        }

        create(frame?: Grafika.IFrame): Grafika.IFrame {
            if (!frame) {
                frame = <Grafika.IFrame> { type: "frame" };
            }

            frame.id = frame.id || Grafika.randomUid();
            frame.index = (frame.index >= 0 ? frame.index : (this.grafika.getAnimation().currentFrame || 0));
            frame.modified = frame.modified || true;
            frame.backgroundResourceId = frame.backgroundResourceId || undefined;
            frame.backgroundColor = frame.backgroundColor || this.grafika.getOptions().backgroundColor;
            frame.foregroundColor = frame.foregroundColor || this.grafika.getOptions().foregroundColor;
            frame.layers = frame.layers || [ this.layerRenderer.create() ];
            frame.type = "frame";

            return frame;
        }

        draw(context: CanvasRenderingContext2D, frame: Grafika.IFrame) {
            let options = this.grafika.getOptions();
            let animation = this.grafika.getAnimation();
            let frames = this.grafika.getFrames();
            let scale = this.grafika.getScale();

            // previous frame
            if (options.useCarbonCopy && animation.currentFrame > 0){
                let previousFrame = frames[animation.currentFrame - 1];
                if (previousFrame){
                    this.drawLayers(context, previousFrame, { carbonCopy: true });
                }
                // FIX for weird bleed path
                context.beginPath();
            }
            // the real frame
            this.drawLayers(context, frame);

            // navigation text
            if (options.useNavigationText) {
                context.fillStyle = 'gray';
                context.font = '25px verdana';
                context["fontWeight"] = 'bold';
                context.fillText((animation.currentFrame + 1) + ' / ' + (frames.length), 
                    options.navigationTextX * scale.x, 
                    options.navigationTextY * scale.y);   
            }
        }

        drawBackground(context: CanvasRenderingContext2D, frame: Grafika.IFrame, callback: Grafika.OnResourceLoaded){
            this.backgroundColorRenderer.draw(context, frame);
            if (!frame.backgroundResourceId) {
                if (callback) callback();
                return;
            }

            // draw resource
            let resource = this.grafika.getResource(frame.backgroundResourceId);
            this.grafika.getResourceRenderer(resource).draw(context, resource, callback);
        }

        drawLayers(context: CanvasRenderingContext2D, frame: Grafika.IFrame, options: { carbonCopy?: boolean } = { carbonCopy: false }) {
            // selected graphics
            let selectedGraphics = this.grafika.getSelectedGraphics();
            let currentGraphic = this.grafika.getCurrentGraphic();
            
            for (let i = 0; i < selectedGraphics.length; i++) {
                let g = selectedGraphics[i];
                let renderer = this.grafika.getGraphicRenderer(g);
                let rect = renderer.getBounds(g);
                let offset = g.brushSize / 2;
                
                context.lineWidth = 2;
                context.setLineDash([2,4 ]);
                if (frame.backgroundColor != '#000000')
                    context.strokeStyle = 'rgba(0, 0, 0, 0.5)';
                else context.strokeStyle = 'rgba(255, 255, 255, 0.6)';
                context.strokeRect(rect.x - offset - 2, rect.y - offset - 2, rect.width + (offset * 2) + 4, rect.height + (offset * 2) + 4);
            }        
            // current frame
            for (let i = 0; i < frame.layers.length; i++) {
                this.layerRenderer.draw(context, frame.layers[i], options);
            }
            
            if (currentGraphic) {
                let renderer = this.grafika.getGraphicRenderer(currentGraphic);
                renderer.draw(context, currentGraphic);
            }
        }

        getRenderingType(): string {
            return "frame";
        }

    }

    export class LayerRenderer extends Renderer<ILayer> implements ILayerRenderer {
        constructor(grafika: IGrafika) {
            super(grafika);
        }
        
        create(layer?: Grafika.ILayer): Grafika.ILayer {
            if (!layer) {
                layer = <Grafika.ILayer> { type: "layer" };
            }

            layer.id = layer.id || Grafika.randomUid();
            layer.index = layer.index || 0;
            layer.graphics = layer.graphics || []; //this.setGraphics(layer.graphics);

            return layer;
        }

        draw(context: CanvasRenderingContext2D, layer: Grafika.ILayer, options: { carbonCopy?: boolean } = { carbonCopy: false }){
            let g: IGraphic;

            context.setLineDash([]);
            context.lineJoin = "round";
            context.lineCap = "round";
            for(let i = 0; i < layer.graphics.length; i++) {
                g = layer.graphics[i];
                if (options.carbonCopy) {
                    let rgb = Grafika.hexToRgb(g.foregroundColor);
                    g.foregroundAlpha = 'rgba(' + rgb.r + ',' + rgb.g + ',' + rgb.b + ', 0.2)';
                }
                
                this.grafika.getGraphicRenderer(g).draw(context, g);
                
                delete g.foregroundAlpha;
            }
        }

        getRenderingType(): string {
            return "layer";
        }

    }

    export abstract class ResourceRenderer<T extends IResource> extends Renderer<T> implements IResourceRenderer<T> {
        create(resource?: T): T {
            if (!resource) 
                resource = <T> { type: this.getRenderingType() };

            resource.id = resource.id || Grafika.randomUid("res");
            resource.type = resource.type || this.getRenderingType();

            return resource;
        }

        abstract draw(context: CanvasRenderingContext2D, resource: T, callback?: Grafika.OnResourceLoaded);
    }

    ////////////////////////////////////////////////////////
    
    export class BackgroundLayerRenderer extends ResourceRenderer<Grafika.IBackgroundLayerResource> {
        create(resource?: Grafika.IBackgroundLayerResource) {
            resource = super.create(resource);
            resource.graphics = resource.graphics || undefined;
            return resource;
        }

        draw(context: CanvasRenderingContext2D, resource: Grafika.IBackgroundLayerResource, callback?: Grafika.OnResourceLoaded){
            let g: IGraphic;

            context.setLineDash([]);
            context.lineJoin = "round";
            context.lineCap = "round";
            for(let i = 0; i < resource.graphics.length; i++) {
                g = resource.graphics[i];
                this.grafika.getGraphicRenderer(g).draw(context, g);
            }

            if (callback) callback(undefined, resource);
        }

        getRenderingType(): string {
            return "background-layer";
        }
    }

    export class BackgroundColorRenderer extends ResourceRenderer<Grafika.IBackgroundColorResource> {
        create(resource?: Grafika.IBackgroundColorResource) {
            resource = super.create(resource);
            resource.backgroundColor = resource.backgroundColor || "#ffffff";
            return resource;
        }

        draw(context: CanvasRenderingContext2D, resource: Grafika.IBackgroundColorResource, callback?: Grafika.OnResourceLoaded) {
            context.beginPath();
            context.rect(-2, -2, parseInt(context.canvas.getAttribute('width')) + 2, parseInt(context.canvas.getAttribute('height')) + 2);
            context.fillStyle = resource.backgroundColor;
            context.fill();    

            if (callback) callback(undefined, resource);    
        }

        getRenderingType() {
            return "background-color";
        }
    }

    export class BackgroundImageRenderer extends ResourceRenderer<Grafika.IBackgroundImageResource> {
        create(resource?: Grafika.IBackgroundImageResource) {
            resource = super.create(resource);
            resource.mime = resource.mime || undefined;
            resource.base64 = resource.base64 || undefined;
            resource.url = resource.url || undefined;

            return resource;
        }

        draw(context: CanvasRenderingContext2D, resource: Grafika.IBackgroundImageResource, callback?: Grafika.OnResourceLoaded) {
            let img = new Image();
            //img.crossOrigin = "use-credentials";
            img.onload = () => {
                context.drawImage(img, 0, 0, parseInt(context.canvas.getAttribute('width')), parseInt(context.canvas.getAttribute('height')));
                if (callback) callback(undefined, resource);
            };
            img.onerror = (e) => {
                if (callback) callback(new Error("Unable to render image"), resource);
            };
            img.crossOrigin = "Anonymous";
            img.src = this.from(resource, callback);
        }

        getRenderingType() {
            return "background-image";
        }

        private from(resource: Grafika.IBackgroundImageResource, callback?: Grafika.OnResourceLoaded): string {
            if (resource.base64)
                return this.fromBase64(resource);
            if (resource.url)
                return this.fromUrl(resource);

            callback(new Error("Unable to read image data"), resource);
        }

        private fromBase64(resource: Grafika.IBackgroundImageResource): string {
            return `data:${resource.mime};base64,${resource.base64}`;
        }

        private fromUrl(resource: Grafika.IBackgroundImageResource): string {
            return resource.url;
        }
    }

    ////////////////////////////////////////////////////////

    export abstract class GraphicRenderer<T extends IGraphic> extends Renderer<T> implements IGraphicRenderer<T> {
        constructor(grafika: Grafika.IGrafika){
            super(grafika);
        }

        create(graphic?: T): T {
            if (!graphic) 
                graphic = <T> { type: this.getRenderingType() };

            graphic.id = graphic.id || Grafika.randomUid();
            graphic.x = graphic.x || 0;
            graphic.y = graphic.y || 0;
            graphic.width = graphic.width || 10;
            graphic.height = graphic.height || 10;
            graphic.backgroundColor = graphic.backgroundColor || "#ffffff";
            graphic.foregroundColor = graphic.foregroundColor || "#000000";
            graphic.foregroundAlpha = graphic.foregroundAlpha || undefined;
            graphic.isFilled = (Grafika.isDefined(graphic.isFilled) && graphic.isFilled != null) ? graphic.isFilled : false;
            graphic.isVisible = (Grafika.isDefined(graphic.isVisible) && graphic.isVisible != null) ? graphic.isVisible : true;
            graphic.brushSize = graphic.brushSize || 5;
            graphic.type = graphic.type || undefined;

            return graphic;
        }

        getBounds(graphic: T): IRectangleBound {
            return {
                x: graphic.width > 0 ? graphic.x : graphic.x + graphic.width,
                y: graphic.height > 0 ? graphic.y : graphic.y + graphic.height,
                width: Math.abs(graphic.width),
                height: Math.abs(graphic.height)
            };
        }
        contains(graphic: T, x: number, y: number): boolean {
            let bounds = this.getBounds(graphic);
            return bounds.x < x && 
                    bounds.x + bounds.width > x && 
                    bounds.y < y && bounds.y + bounds.height > y;
        }
        isValid(graphic: T): boolean {
            return Math.abs(graphic.width) > 20 && Math.abs(graphic.height) > 20;
        }
        
        draw(context: CanvasRenderingContext2D, graphic: T) {
            context.lineWidth = graphic.brushSize > 1 ? graphic.brushSize : 1;
            context.strokeStyle = graphic.foregroundAlpha || graphic.foregroundColor;
            context.fillStyle = graphic.foregroundAlpha || graphic.foregroundColor;
            this.onDraw(context, graphic);
        }

        move(context: CanvasRenderingContext2D, graphic: T, x: number, y: number, lastX: number, lastY: number){
            this.onMove(context, graphic, x, y, lastX, lastY);
        }
        
        invoke(context: CanvasRenderingContext2D, graphic: T, eventType: string, eventX: number, eventY: number){
            this.onEvent(context, graphic, eventType, eventX, eventY);
        }

        abstract onDraw(context: CanvasRenderingContext2D, graphic: T);
        abstract onMove(context: CanvasRenderingContext2D, graphic: T, x: number, y: number, lastX: number, lastY: number);
        abstract onEvent(context: CanvasRenderingContext2D, graphic: T, eventType: string, eventX: number, eventY: number);
    }

    ////////////////////////////////////////////////////////
    
    export class FreeformRenderer extends GraphicRenderer<Grafika.Graphics.IFreeform> {
        point: IPoint;
        
        create(graphic?: Grafika.Graphics.IFreeform): Grafika.Graphics.IFreeform {
            graphic = super.create(graphic);
            graphic.points = graphic.points || [];

            return graphic;
        }

        calculateBounds(graphic: Grafika.Graphics.IFreeform): IRectangleBound {
            let rect = {
                x: graphic.x,
                y: graphic.y,
                width: graphic.x,
                height: graphic.y,
            }
            for (let pI = 0; pI < graphic.points.length; pI++) {
                let p = graphic.points[pI];
                if (rect.x > p.x)
                    rect.x = p.x;
                if (rect.y > p.y)
                    rect.y = p.y;
                if (rect.width < p.x)
                    rect.width = p.x;
                if (rect.height < p.y)
                    rect.height = p.y;
            }
            rect.width = rect.width - rect.x;
            rect.height = rect.height - rect.y;

            return rect;
        }

        getBounds(graphic: Grafika.Graphics.IFreeform): IRectangleBound {
            let rect = this.calculateBounds(graphic);
            
            if (rect.height - rect.y < 10 || rect.width - rect.x < 10) {
                rect.y -= 5;
                rect.x -= 5;
                rect.height += 10;
                rect.width += 10;
            }
            
            return rect;
        }

        isValid(graphic: Grafika.Graphics.IFreeform): boolean {
            let rect = this.calculateBounds(graphic);
            return rect.width > 5 || rect.height > 5;
        }

        onDraw(context: CanvasRenderingContext2D, graphic: Grafika.Graphics.IFreeform) {
            context.beginPath();
            context.moveTo(graphic.x, graphic.y);

            for (let i = 0; i < graphic.points.length; i++) {
                this.point = graphic.points[i];
                context.lineTo(this.point.x, this.point.y);
            }

            if (graphic.isFilled)
                context.fill();
            else context.stroke();
        }
        
        onMove(context: CanvasRenderingContext2D, graphic: Grafika.Graphics.IFreeform, x: number, y: number, lastX: number, lastY: number){
            // implemented: don't touch (08/27/2015)
            let lastGX = graphic.x;
            let lastGY = graphic.y;
            graphic.x = graphic.x + (x - lastX);
            graphic.y = graphic.y + (y - lastY);
            let deltaX = lastGX - graphic.x;
            let deltaY = lastGY - graphic.y;
            for (let i = 0; i < graphic.points.length; i++){
                graphic.points[i].x -= deltaX;
                graphic.points[i].y -= deltaY;
            }
        }
        
        onEvent(context: CanvasRenderingContext2D, graphic: Grafika.Graphics.IFreeform, eventType: string, eventX: number, eventY: number){
            switch (eventType) {
                case "mousemove":
                    graphic.points.push({ x: eventX, y: eventY });
                    break;
            }
        }

        getRenderingType(): string {
            return "freeform";
        }
    }

    ////////////////////////////////////////////////////////

    export class LineRenderer extends GraphicRenderer<Grafika.Graphics.ILine> {
        create(graphic?: Grafika.Graphics.ILine): Grafika.Graphics.ILine {
            graphic = super.create(graphic);
            graphic.endX = graphic.endX || graphic.x;
            graphic.endY = graphic.endY || graphic.y;

            return graphic;
        }

        getBounds(graphic: Grafika.Graphics.ILine): IRectangleBound {	
            return {
                x: graphic.x < graphic.endX ? graphic.x : graphic.endX,
                y: graphic.y < graphic.endY ? graphic.y : graphic.endY,
                width: graphic.x > graphic.endX ? graphic.x - graphic.endX : graphic.endX - graphic.x,
                height: graphic.y > graphic.endY ? graphic.y - graphic.endY : graphic.endY - graphic.y,
            };
        }

        isValid(graphic: Grafika.Graphics.ILine): boolean {
            return Math.abs(graphic.endX - graphic.x) > 20 || Math.abs(graphic.endY - graphic.y) > 20;
        }

        onDraw(context: CanvasRenderingContext2D, graphic: Grafika.Graphics.ILine) {
            context.beginPath();
            context.moveTo(graphic.x, graphic.y);
            context.lineTo(graphic.endX, graphic.endY);
            context.stroke();
        }
        
        onMove(context: CanvasRenderingContext2D, graphic: Grafika.Graphics.ILine, x: number, y: number, lastX: number, lastY: number){
            // implemented: don't touch (08/27/2015)
            graphic.x = graphic.x + (x - lastX);
            graphic.y = graphic.y + (y - lastY);
            graphic.endX = graphic.endX + (x - lastX);
            graphic.endY = graphic.endY + (y - lastY);
        }
        
        onEvent(context: CanvasRenderingContext2D, graphic: Grafika.Graphics.ILine, eventType: string, eventX: number, eventY: number){
            switch (eventType) {
                case "mousedown":
                    graphic.x = eventX;
                    graphic.y = eventY;
                case "mousemove":
                    graphic.endX = eventX;
                    graphic.endY = eventY;
                    break;
            }
        }

        getRenderingType(): string {
            return "line";
        }
    }

    ////////////////////////////////////////////////////////

    export class RectangleRenderer<T extends Grafika.Graphics.IRectangle> extends GraphicRenderer<Grafika.Graphics.IRectangle> {  
        onDraw(context: CanvasRenderingContext2D, graphic: Grafika.Graphics.IRectangle) {
            if (graphic.isFilled)
                context.fillRect(graphic.x, graphic.y, graphic.width, graphic.height);
            else {
                context.strokeRect(graphic.x, graphic.y, graphic.width, graphic.height);
            }
        }
        
        onMove(context: CanvasRenderingContext2D, graphic: Grafika.Graphics.IRectangle, x: number, y: number, lastX: number, lastY: number){
            graphic.x = graphic.x + (x - lastX);
            graphic.y = graphic.y + (y - lastY);
        }
        
        onEvent(context: CanvasRenderingContext2D, graphic: Grafika.Graphics.IRectangle, eventType: string, eventX: number, eventY: number){
            switch (eventType) {
                case "mousemove":
                    graphic.width = eventX - graphic.x;
                    graphic.height = eventY - graphic.y;
                    break;
            }
        }

        getRenderingType(): string {
            return "rectangle";
        }
    }

    ////////////////////////////////////////////////////////

    export class SquareRenderer extends RectangleRenderer<Grafika.Graphics.ISquare> {   
        onEvent(context: CanvasRenderingContext2D, graphic: Grafika.Graphics.ISquare, eventType: string, eventX: number, eventY: number){
            switch (eventType) {
                case "mousemove":
                    graphic.width = eventX - graphic.x;
                    graphic.height = eventY - graphic.y;
                    graphic.width = graphic.width > graphic.height ? graphic.height : graphic.width;
                    graphic.height = graphic.width > graphic.height ? graphic.height : graphic.width;
                    break;
            }
        }

        getRenderingType(): string {
            return "square";
        }
    }

    ////////////////////////////////////////////////////////

    export class CircleRenderer<T extends Grafika.Graphics.ICircle> extends RectangleRenderer<T> {
        create(graphic?: Grafika.Graphics.ICircle): Grafika.Graphics.ICircle {
            graphic = <Grafika.Graphics.ICircle> super.create(graphic);
            graphic.radius = graphic.radius || 10;

            return graphic;
        }

        getBounds(graphic: T): IRectangleBound {		
            return {
                x: graphic.x - graphic.radius,
                y: graphic.y - graphic.radius,
                width: graphic.radius * 2,
                height: graphic.radius * 2,
            };
        }

        isValid(graphic: T): boolean {
            return graphic.radius > 5;
        }

        onDraw(context: CanvasRenderingContext2D, graphic: T) {
            context.beginPath();
            context.arc(graphic.x, graphic.y, graphic.radius, 0, 2 * Math.PI);
            if (graphic.isFilled)
                context.fill();
            else
                context.stroke();
        }
        
        onEvent(context: CanvasRenderingContext2D, graphic: T, eventType: string, eventX: number, eventY: number){
            switch (eventType) {
                case "mousemove":
                    graphic.radius = Math.abs(eventX - graphic.x);
                    break;
            }
        }

        getRenderingType(): string {
            return "circle";
        }
    }

    ////////////////////////////////////////////////////////

    export class OvalRenderer extends CircleRenderer<Grafika.Graphics.IOval> {

        create(graphic?: Grafika.Graphics.IOval): Grafika.Graphics.IOval {
            graphic = <Grafika.Graphics.IOval> super.create(graphic);
            graphic.radiusY = graphic.radiusY || 5;

            return graphic;
        }

        getBounds(graphic: Grafika.Graphics.IOval): IRectangleBound {		
            return {
                x: graphic.x - graphic.radius,
                y: graphic.y - graphic.radiusY,
                width: graphic.radius * 2,
                height: graphic.radiusY * 2,
            };
        }

        isValid(graphic: Grafika.Graphics.IOval): boolean {
            return graphic.radius > 10 && graphic.radiusY > 10;
        }            

        onDraw(context: CanvasRenderingContext2D, graphic: Grafika.Graphics.IOval) {
            context.beginPath();
            (<any> context).ellipse(graphic.x, graphic.y, graphic.radius, graphic.radiusY, 0, 0, 2 * Math.PI);
            if (graphic.isFilled)
                context.fill();
            else context.stroke();
        }
        
        onEvent(context: CanvasRenderingContext2D, graphic: Grafika.Graphics.IOval, eventType: string, eventX: number, eventY: number){
            switch (eventType) {
                case "mousemove":
                    graphic.radius = Math.abs(eventX - graphic.x);
                    graphic.radiusY = Math.abs(eventY - graphic.y);
                    break;
            }
        }

        getRenderingType(): string {
            return "oval";
        }
    }

    ////////////////////////////////////////////////////////

    export class TriangleRenderer extends RectangleRenderer<Grafika.Graphics.ITriangle> {
        onDraw(context: CanvasRenderingContext2D, graphic: Grafika.Graphics.ITriangle) {
            context.beginPath();
            context.moveTo(graphic.x + (graphic.width/2), graphic.y);
            context.lineTo(graphic.x, graphic.y + graphic.height);
            context.lineTo(graphic.x + graphic.width, graphic.y + graphic.height);
            context.closePath();
            if (graphic.isFilled)
                context.fill();
            else context.stroke();
        }

        getRenderingType(): string {
            return "triangle";
        }

    }

    ////////////////////////////////////////////////////////

    export class TextRenderer extends RectangleRenderer<Grafika.Graphics.IText> {
        create(graphic?: Grafika.Graphics.IText): Grafika.Graphics.IText {
            if (!graphic) {
                graphic = <Grafika.Graphics.IText> {
                    isFilled: true,
                    height: 25
                };
            }
            graphic = <Grafika.Graphics.IText> super.create(graphic);
            graphic.text = graphic.text || "";
            graphic.font = graphic.font || "verdana";
            graphic.fontWeight = graphic.fontWeight || "normal";

            return graphic;
        }

        isValid(graphic: Grafika.Graphics.IText): boolean {
            return graphic.text && graphic.text.length > 0;
        }

        onDraw(context: CanvasRenderingContext2D, graphic: Grafika.Graphics.IText) {
            context.font = graphic.height + 'px ' + graphic.font;
            if (graphic.isFilled) {
                context.fillStyle = graphic.foregroundAlpha || graphic.foregroundColor;
                context.fillText(graphic.text, graphic.x, graphic.y + graphic.height);
            }
            else {
                context.strokeStyle = graphic.foregroundAlpha || graphic.foregroundColor;
                context.strokeText(graphic.text, graphic.x, graphic.y + graphic.height);
            }
        }
        
        onEvent(context: CanvasRenderingContext2D, graphic: Grafika.Graphics.IText, eventType: string, eventX: number, eventY: number){
            switch (eventType) {
                case "mouseup": 
                    graphic.text = this.prompt('Insert text');
                    this.drawFocusRectangle(context, graphic);
                    
                    this.draw(context, graphic);
                    break;
            }
        } 

        drawFocusRectangle(context: CanvasRenderingContext2D, graphic: Grafika.Graphics.IText) {
            let rect = context.measureText(graphic.text);
            graphic.width = rect.width;
            context.lineWidth = 1;
            context.setLineDash([2,4]);
            context.strokeStyle = graphic.foregroundColor;
            context.rect(graphic.x, graphic.y, graphic.width, graphic.height);		
        }

        prompt(text:string, title?:string) {
            return window.prompt(text, title);
        }

        getRenderingType(): string {
            return "text";
        }
    }
        
}

///////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
/////////////////////////////////////////// @COMMANDS /////////////////////////////////////////////////////////////////////
///////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
namespace Grafika {
    export class CommandManager implements ICommandManager {
        undoActions: Grafika.IAction[] = [];
        redoActions: Grafika.IAction[] = [];

        constructor(private grafika: IGrafika) {
        };

        clearActions = () => {
            this.undoActions = [];
            this.redoActions = [];
        }

        addAction = (action: IAction) => {
            this.undoActions.push(action);
            this.redoActions = [];  // reset
        }

        canUndo = () => this.undoActions.length > 0;
        canRedo = () => this.redoActions.length > 0;

        undo = () => {
            if (!this.canUndo()) {
                Grafika.log(this.grafika, 'No undo!');
                return;
            }

            let action = this.undoActions.pop();
            action.undo();

            this.redoActions.push(action);
            Grafika.log(this.grafika, "Undo: " + action.event);
        }

        redo = () => {
            if (!this.canRedo()) {
                Grafika.log(this.grafika, 'No redo!');
                return;
            }

            let action = this.redoActions.pop();
            action.redo();

            this.undoActions.push(action);
            Grafika.log(this.grafika, "Redo: " + action.event);
        }
    }

    export abstract class GraphicAction implements IAction {
        grafika: Grafika;
        graphic: IGraphic;
        event: string;

        constructor(grafika: IGrafika, graphic: IGraphic, event: string) {
            this.grafika = <Grafika> grafika;
            this.event = event;
            this.graphic = Grafika.clone(graphic);
        }

        undo = () => {
            this.performUndo();
            this.grafika.refreshFrame();
        }

        redo = () => {
            this.performRedo();
            this.grafika.refreshFrame();
        }

        getRenderer = () => this.grafika.getGraphicRenderer(this.graphic);

        abstract performUndo();
        abstract performRedo();
    }

    export class GraphicCreated extends GraphicAction {
        constructor(grafika: IGrafika, graphic: IGraphic) {
            super(grafika, graphic, Grafika.EVT_GRAPHIC_CREATED);
        }

        performUndo() {
            this.grafika.deleteGraphic(this.graphic.id, false);
        }

        performRedo() {
            this.grafika.getFrame().layers[0].graphics.push(this.graphic);
        }
    }

    export class GraphicDeleted extends GraphicAction {
        constructor(grafika: IGrafika, graphic: IGraphic) {
            super(grafika, graphic, Grafika.EVT_GRAPHIC_DELETED);
        }

        performUndo() {
            this.grafika.frame.layers[0].graphics.push(this.graphic);
        }

        performRedo() {
            this.grafika.deleteGraphic(this.graphic.id, false);
        }
    }

    export class GraphicMoved extends GraphicAction {
        private previous: IGraphic;

        constructor(grafika: IGrafika, graphic: IGraphic, previous: IGraphic) {
            super(grafika, graphic, Grafika.EVT_GRAPHIC_MOVED);
            this.previous = Grafika.clone(previous);
        }

        performUndo() {
            this.grafika.deleteGraphic(this.graphic.id, false);
            this.grafika.frame.layers[0].graphics.push(this.previous);
        }

        performRedo() {
            this.grafika.deleteGraphic(this.graphic.id, false);
            this.grafika.frame.layers[0].graphics.push(this.graphic);
        }
    }

    export class GraphicPasted extends GraphicCreated {
        constructor(grafika: IGrafika, graphic: IGraphic) {
            super(grafika, graphic);
            this.event = Grafika.EVT_GRAPHIC_PASTED;
        }
    }
}

///////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
/////////////////////////////////////////// @FUNCTIONS ////////////////////////////////////////////////////////////////////
///////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
namespace Grafika {
    /**
     * Expand shorthand form (e.g. "03F") to full form (e.g. "0033FF")
     * */
    const COLOR_SHORTHAND_REGEX = /^#?([a-f\d])([a-f\d])([a-f\d])$/i;
    const COLOR_HEX_SHORTHAND_REGEX = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i;

    export function isDefined(any: any) {
        return typeof any !== "undefined";
    }

    export function isUndefined(any: any) {
        return typeof any === "undefined";
    }

    export function log(src: ILogSource, ...optionalParams: string[]) {
		if (!src.isLogEnabled()) return;
		if (optionalParams.length == 0) return;
		
		console.log(src.getName(), optionalParams.join(","));
    }
    
    export function randomUid(prefix?: string): string {
        return (prefix || "") + (("000000" + (Math.random()*Math.pow(36,6) << 0).toString(36)).slice(-6));
    }

    export function hexToRgb(hex: string) {
        hex = hex.replace(COLOR_SHORTHAND_REGEX, (m, r, g, b) => {
            return r + r + g + g + b + b;
        });
    
        let result = COLOR_HEX_SHORTHAND_REGEX.exec(hex);
        return result ? { r: parseInt(result[1], 16), g: parseInt(result[2], 16), b: parseInt(result[3], 16) } : { r: 0, g: 0, b: 0 };
    }

    /**
     * Correctly calculate Mouse/touch event coordinates relative the scaling
     */
    export function calculateCoordinates(scale: IScale, e: MouseEvent|TouchEvent|any): Grafika.IPoint {
        let eX = e.offsetX;
        let eY = e.offsetY;
        if (e.changedTouches){
            eX = e.changedTouches[0].pageX;
            eY = e.changedTouches[0].pageY;
        }

        return { 
            x: +(eX * scale.x).toFixed(1), // allow just 1 decimal points
            y: +(eY * scale.y).toFixed(1)  // allow just 1 decimal points
        };
    }

    /**
     * Calculate furthest distance between x,y to a graphic location
     * Pythagorean Theorem
     */
    export function calculateFurthestDistance(x: number, y: number, graphic: Grafika.IGraphic): number {
        let sideA = y - graphic.y;
        let sideB = x - graphic.x;
        return Math.sqrt(Math.pow(sideA, 2) + Math.pow(sideB, 2));
    }

    /**
     * Redraw/Reset canvas removing everything in it
     */
    export function clearCanvas(context: CanvasRenderingContext2D) {
        context.canvas.width = context.canvas.width;
        context.lineJoin = "round";
        context.lineCap = "round";
    }

    /**
     * Deep-clone an object
     */
    export function clone<T>(any: T): T {
        return JSON.parse(JSON.stringify(any));
    }

    //////////////////////////////// POLYFILL //////////////////////////////////////
    
    /** 
     * RequestAnimationFrame Polyfill 
     * https://gist.github.com/paulirish/1579671
     * */
    (function () {
        let lastTime = 0;
        let vendors = ['ms', 'moz', 'webkit', 'o'];
        for(let x = 0; x < vendors.length && !window.requestAnimationFrame; ++x) {
            window.requestAnimationFrame = window[vendors[x]+'RequestAnimationFrame'];
            window.cancelAnimationFrame = window[vendors[x]+'CancelAnimationFrame'] 
                                    || window[vendors[x]+'CancelRequestAnimationFrame'];
        }
    
        if (!window.requestAnimationFrame)
            (<any> window).requestAnimationFrame = (callback, element) => {
                let currTime = new Date().getTime();
                let timeToCall = Math.max(0, 16 - (currTime - lastTime));
                let id = window.setTimeout(() => { callback(currTime + timeToCall); }, timeToCall);
                lastTime = currTime + timeToCall;
                return id;
            };
    
        if (!window.cancelAnimationFrame)
            window.cancelAnimationFrame = (id) => clearTimeout(id);
    })();

} 