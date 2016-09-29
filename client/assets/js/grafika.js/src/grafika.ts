class Grafika implements Grafika.IGrafika {
    private version: string;
    private animation: Grafika.IAnimation = <Grafika.IAnimation> {};
    private frame: Grafika.IFrame;
    private selectedGraphics: Grafika.IGraphic[] = [];
    private isMovingGraphics: boolean = false;
    private currentGraphic: Grafika.IGraphic;
    private animator: number;
    private options: Grafika.IOption = {
        backgroundColor: '#ffffff',
        foregroundColor: '#000000',
        brushSize: 2,
        graphic: 'freeform',
        graphicFill: false,
        useCarbonCopy: true,
        useNavigationText: true,
        debugMode: true,
        drawingMode: 'none',
		loop: false
    };
    private canvas: HTMLCanvasElement;
    private context: CanvasRenderingContext2D;
    private lastX: number;
    private lastY: number;
    private callback: Grafika.ICallback = {
        on : (eventName, obj) => this.log('[callback] ' + eventName, obj) 
    };
    private plugins: Grafika.IPlugin[] = [];
    private renderers: Grafika.IRenderer<Grafika.IDrawable>[] = [];
    private animRenderer: Grafika.IAnimationRenderer;
    private frameRenderer: Grafika.IFrameRenderer;
    private layerRenderer: Grafika.ILayerRenderer;

    constructor() {
        this.version = Grafika.VERSION;
    }
    
    initialize(canvasId: string, opts?: Grafika.IOption, anim?: Grafika.IAnimation){
		//this.log('Grafika v.' + api.version);
		this.canvas = this.validateCanvas(canvasId);

        this.renderers.push(this.animRenderer = new Grafika.AnimationRenderer(this));
        this.renderers.push(this.frameRenderer = new Grafika.FrameRenderer(this));
        this.renderers.push(this.layerRenderer =new Grafika.LayerRenderer(this));
        this.renderers.push(new Grafika.Renderers.RectangleRenderer(this));
        this.renderers.push(new Grafika.Renderers.SquareRenderer(this));
        this.renderers.push(new Grafika.Renderers.CircleRenderer(this));
        this.renderers.push(new Grafika.Renderers.OvalRenderer(this));
        this.renderers.push(new Grafika.Renderers.FreeformRenderer(this));
        this.renderers.push(new Grafika.Renderers.LineRenderer(this));
        this.renderers.push(new Grafika.Renderers.TriangleRenderer(this));
        this.renderers.push(new Grafika.Renderers.LineRenderer(this));
        this.renderers.push(new Grafika.Renderers.TextRenderer(this));

		this.setAnimation(anim);	
		this.setOptions(opts);
		
		// grab plugins
		if (Grafika.Plugins){
			Grafika.Plugins.forEach((func) => {
				var plugin = func(this);
				this.log('Plugin: ' + (plugin.name) + ' v.' + (plugin.version || '{unknown}'));
				this.plugins.push(plugin);
			});
		}
	
		this.log('Grafika v.' + this.version + ' [initialized]', this);

		this.callback.on('initialized');	
    }

    destroy() {
        this.selectedGraphics = [];
        if (this.isPlaying()) 
            this.pause();
        this.clearCanvas();
        this.clear();
        this.setAnimation(this.animRenderer.create());
        this.refresh();
        this.callback.on('destroyed');
    }

    getAnimation(): Grafika.IAnimation{
        return this.animation;
    }
    setAnimation(anim: Grafika.IAnimation){
        if (!anim) {
            anim = <Grafika.IAnimation> { };			
        }
        else {
            if (!anim.name) throw new Error('Animation name is required');
            if (!anim.width || !anim.height) throw new Error('Animation width + height is required');
            if (typeof anim.frames === 'undefined' || anim.frames.length == 0) {
                anim.frames = [ this.frameRenderer.create() ];
            }			
        }

		this.animation = this.animRenderer.create(anim);
		this.log('Animation (' + this.animation.localId + ')' +
			' name: ' + this.animation.name +
			', timer: ' + this.animation.timer + 
			', size: ' + this.animation.width + ' x ' + this.animation.height +
			', frames: ' + this.animation.frames.length + ' frames');
			
        this.canvas.setAttribute('width', "" + this.animation.width);
        this.canvas.setAttribute('height', "" + this.animation.height);
		this.setFrames(this.animation.frames);
    }
    saveAnimation(){
	    this.animation.totalFrame = this.animation.frames.length;
		this.animation.modified = false;
		this.animation.dateModified = Date.now();
		this.animation.client = {
			navigator: navigator
		};
		this.callback.on('animationSaved')
    }

    play(){
        if (this.animator)  return; // already animating
        if (!this.animation.timer) 
            this.animation.timer = 500;
		
        this.log('Animation started. Timer: ' + this.animation.timer + 'ms', this.animation);
        this.animator = window.setInterval(() => {
			if (this.animation.currentFrame >= this.animation.frames.length - 1) {
				if (this.options.loop)
					this.animation.currentFrame = 0;
				else
					return this.pause();
			}
			else {
				this.navigateTo(this.animation.currentFrame + 1, false);
			}
        }, this.animation.timer);
		
		this.callback.on('frameCount', this.animation.frames.length);
        this.callback.on('playing', true);
        this.navigateToFrame(0);
    }
    pause(){
        if (typeof this.animator === 'undefined') return;
        window.clearInterval(this.animator);
        this.animator = null;

        this.callback.on('playing', false);
        this.log('Animation stopped');
    }
    isPlaying(): boolean{
        return this.animator != null;
    }

    isModified(): boolean{
        if (this.animation.modified) return true;
        if (this.frame.modified) return true;
        return false;
    }
    save(){
        this.saveAnimation();
        this.saveFrame();
    }

    getFrame(): Grafika.IFrame{
		return this.frame;
    }
    getFrames(): Grafika.IFrame[]{
		return this.animation.frames;
    }
    setFrames(frames: Grafika.IFrame[]){
        this.animation.frames = frames;
		this.frame = this.animation.frames[0];
		this.navigateToFrame(0);
		this.callback.on('frameCount', this.animation.totalFrame);
    }
    saveFrame(){
        this.frame.modified = false;
        this.animation.frames[this.animation.currentFrame] = this.frame;
        this.callback.on('frameSaved', this.animation.currentFrame);
    }
    nextFrame(){
        this.navigateToFrame(this.animation.currentFrame + 1);
    }
    previousFrame(){
        this.navigateToFrame(this.animation.currentFrame - 1);
    }
    navigateToFrame(index: number){
		this.navigateTo(index, true);
    }

    findSelectedGraphics(x: number, y: number): Grafika.IGraphic[]{
        this.selectedGraphics = [];
        for (let i = 0; i < this.frame.layers.length; i++){
            let layer = this.frame.layers[i];
            for (let j = 0; j < layer.graphics.length; j++){
                let g = layer.graphics[j];
                if (this.getGraphicRenderer(g).contains(g, x, y)){
                    this.selectedGraphics.push(g);
                    return this.selectedGraphics;
                }
            }
        }
		
        return this.selectedGraphics;
    }
    getSelectedGraphics(): Grafika.IGraphic[]{
        return this.selectedGraphics;
    }
    deleteSelectedGraphics(){
        this.frame.modified = true;
        var temp = [];
		var graphics = this.frame.layers[0].graphics;
        for(var i = 0; i < graphics.length; i++){
            var found = false;
            for (var j = 0; j < this.selectedGraphics.length; j++){
                if (graphics[i].id == this.selectedGraphics[j].id){
                    found = true;
                    if (found) break;
                }
            }
            
            if (!found) temp.push(graphics[i]);
        }
        graphics = temp;
        this.selectedGraphics = [];
        this.refresh();
    }
    getCurrentGraphic(): Grafika.IGraphic{
        return this.currentGraphic;
    }

    getOptions(): Grafika.IOption {
        return this.options;
    }

    getCanvas(): HTMLCanvasElement {
        return this.canvas;
    }
    getCanvasContext(): CanvasRenderingContext2D {
        return this.context;
    }
    setCallback(callback: Grafika.ICallback){
        if (!callback) throw new Error('callback cannot be undefined');
        this.callback = callback;
    }

    setOptions(opts: Grafika.IOption){
        if (!opts) return;
        if (opts.backgroundColor) {
            this.options.backgroundColor = opts.backgroundColor;
            this.frame.backgroundColor = this.options.backgroundColor;
			this.frame.modified = true;
            this.refresh();
        }
        if (opts.foregroundColor) {
            this.options.foregroundColor = opts.foregroundColor;
            this.frame.foregroundColor = this.options.foregroundColor;
            this.refresh();
        }
        if (opts.brushSize) this.options.brushSize = opts.brushSize;
        if (opts.graphic) {
            this.options.graphic = opts.graphic;
            this.refresh();
        }
        if (typeof opts.graphicFill !== 'undefined' && opts.graphicFill != null) {
            this.options.graphicFill = opts.graphicFill;
            this.refresh();
        }
        if (typeof opts.useCarbonCopy !== 'undefined' && opts.useCarbonCopy != null) {
            this.options.useCarbonCopy = opts.useCarbonCopy;
            this.refresh();
        }
        if (typeof opts.useNavigationText !== 'undefined' && opts.useNavigationText != null) {
            this.options.useNavigationText = opts.useNavigationText;
            this.refresh();
        }
		if (typeof opts.loop !== 'undefined' && opts.loop != null) {
			this.options.loop = opts.loop;
		}
        if (opts.drawingMode){
            var mode = opts.drawingMode.toLowerCase();
            if (mode != Grafika.MODE_NONE && mode != Grafika.MODE_PAINT && mode != Grafika.MODE_MOVE && mode != Grafika.MODE_SELECT && mode != Grafika.MODE_DELETE)
                throw new Error('Drawing mode is not supported: ' + mode);
            this.options.drawingMode = mode;
            if (this.options.drawingMode == Grafika.MODE_PAINT || this.options.drawingMode == Grafika.MODE_NONE)
            this.refresh();
			if (this.options.drawingMode == Grafika.MODE_DELETE) {
				this.deleteSelectedGraphics();
				this.refresh();
			}
        }
        if (typeof opts.debugMode !== 'undefined' && opts.debugMode != null){
            this.options.debugMode = opts.debugMode;
        }
        this.log("Options: ", this.options);
    }

    refresh() {
        this.currentGraphic = null;
        return this.setFrame(this.frame, true);
    }
    clear() {
		this.frame = this.frameRenderer.create();
		this.refresh();
    }
    getRenderer<TRenderer extends Grafika.IRenderer<TDrawable>, TDrawable extends Grafika.IDrawable>(drawableOrType: TDrawable | Grafika.IDrawable | string): TRenderer {
        for(let i = 0; i < this.renderers.length; i++){
            if (this.renderers[i].canRender(drawableOrType))
                return <TRenderer> this.renderers[i];
        }
        throw new Error("No renderer found for " + drawableOrType);
    }
    getGraphicRenderer<TGraphic extends Grafika.IGraphic>(graphicOrType: TGraphic | Grafika.IGraphic | string): Grafika.IGraphicRenderer<TGraphic>{
        return this.getRenderer<Grafika.IGraphicRenderer<TGraphic>, TGraphic>(graphicOrType);
    }
    
    log(...optionalParams: any[]) {
		if (!this.options.debugMode) return;
		if (arguments.length == 0) return;		
		let params: any = [];
		for (var i = 1; i < arguments.length; i++) {
			params.push(arguments[i]);
		}
		if (params.length == 0) 
			params = '';
		
		console.log('[grafika] ' + arguments[0], params);
    }

    //////////////////////////////////////////

    private validateCanvas(canvasId): HTMLCanvasElement {
        if (!canvasId) throw new Error('canvasId is required');
        this.canvas = <HTMLCanvasElement> (document.querySelector(canvasId) || document.getElementById(canvasId));
        if (!this.canvas) throw new Error('No element found for ' + canvasId + '.');
        this.canvas["isPainting"] = false;
        this.canvas.addEventListener('mousedown', (e) => this.onMouseDown(e));
        this.canvas.addEventListener('touchstart', (e) => this.onMouseDown(e));        
        this.canvas.addEventListener('mousemove', (e) => this.onMouseMove(e));
        this.canvas.addEventListener('touchmove', (e) => this.onMouseMove(e));        
        this.canvas.addEventListener('mouseup', (e) => this.onMouseUp(e));
        this.canvas.addEventListener('touchend', (e) => this.onMouseUp(e));        
        this.canvas.addEventListener('mouseleave', (e) => this.onMouseUp(e));
        this.canvas.addEventListener('touchleave', (e) => this.onMouseUp(e));
		
        this.context = this.canvas.getContext('2d');		
        if (!this.context.setLineDash) {
			this.log('LineDash: is not available!');
            this.context.setLineDash = () => { }			
		}
        
        return this.canvas;
    }

    private navigateTo(idx: number, save: boolean) {
        if (idx <= 0) idx = 0;
        
        // save current frames
        if (save) this.saveFrame();
        this.animation.currentFrame = idx;
        
        this.frame = this.animation.frames[this.animation.currentFrame];
        if (!this.frame){
            this.frame = this.frameRenderer.create();
        }
        if (save) this.saveFrame();
        this.setFrame(this.frame, true);
        
        this.callback.on('frameChanged', this.frame.index);
        this.log('Current Frame: ' + (this.animation.currentFrame + 1) + '/' + this.animation.frames.length, this.frame);
    }

    private setFrame(fr: Grafika.IFrame, clear?: boolean) {
        if (!fr) return;
        if (clear || !fr || fr.id != this.frame.id) {
            this.clearCanvas();
            this.selectedGraphics = [];
            this.frame = fr;
        }
        // background color
        this.context.rect(-2, -2, parseInt(this.canvas.getAttribute('width')) + 2, parseInt(this.canvas.getAttribute('height')) + 2);
        this.context.fillStyle = this.frame.backgroundColor;
        this.context.fill();
        // navigation text
        if (this.options.useNavigationText) {
            this.context.fillStyle = 'gray';
            this.context.font = '25px verdana';
            this.context["fontWeight"] = 'bold';
            this.context.fillText((this.animation.currentFrame + 1) + ' / ' + (this.animation.frames.length), 15, 40);   
        }

        if (this.frame.backgroundResourceId) {
            var img = new Image();
            img.onload = () => {
                this.context.drawImage(img, 0, 0, parseInt(this.canvas.getAttribute('width')), parseInt(this.canvas.getAttribute('height')));
                this.frameRenderer.draw(this.frame);
            };
            img.onerror = (e) => {
                this.frameRenderer.draw(this.frame);
            };
            //img.crossOrigin="anonymous"
            img.crossOrigin = "use-credentials";
            if (!img.src) {
                //img.src = resourceService.getResourceUrl(animation, frame.backgroundResourceId);
            }
        }
        else {
            //backgroundImage.removeAttribute('src');
            this.frameRenderer.draw(this.frame);
        }
    }

    private onMouseDown(e: MouseEvent|TouchEvent|any) {
        if (!e || this.isPlaying()) return;
        if( navigator.userAgent.match(/Android/i) ) {
            e.preventDefault();
        }
        
        if (e.type === 'mousedown' && e.which != 1) return; // left click only
        if (this.isPlaying()) return;
        
        var eX = e.offsetX;
        var eY = e.offsetY;
        if (e.changedTouches){
            eX = e.changedTouches[0].pageX;
            eY = e.changedTouches[0].pageY;
        }

        if (this.options.drawingMode == Grafika.MODE_MOVE && this.selectedGraphics.length > 0) {
            this.isMovingGraphics = true;
            return;
        }
        if (this.options.drawingMode == Grafika.MODE_SELECT){
            var newSelectedGraphics = this.findSelectedGraphics(eX, eY);
            if (newSelectedGraphics.length > 0) {
                this.selectedGraphics = [];
                this.redraw();
                this.selectedGraphics = newSelectedGraphics;
                this.redraw();
                return;
            } else {
                this.selectedGraphics = [];
                this.redraw();
            }
        }

        // painting
        if (this.options.drawingMode != Grafika.MODE_PAINT) return;

        let renderer = this.getGraphicRenderer(this.options.graphic);

        this.canvas["isPainting"] = this.options.drawingMode == Grafika.MODE_PAINT;
        this.currentGraphic = renderer.create();
        this.currentGraphic.isFilled = this.options.graphicFill;
        this.currentGraphic.x = eX;
        this.currentGraphic.y = eY;
        this.currentGraphic.brushSize = this.options.brushSize;
        this.currentGraphic.backgroundColor = this.options.backgroundColor;
        this.currentGraphic.foregroundColor = this.options.foregroundColor;
        renderer.invoke(this.currentGraphic, "mousedown", eX, eY);
    }

    private onMouseMove(e: MouseEvent|TouchEvent|any) {
        if (!e || this.isPlaying()) return;

        let eX = e.offsetX;
        let eY = e.offsetY;
        if (!eX || !eY){
            if (e.changedTouches){
                eX = e.changedTouches[0].pageX;
                eY = e.changedTouches[0].pageY;   
            }
            else return;
        }

        if (this.isMovingGraphics && this.selectedGraphics.length > 0) {			
			if (!this.lastX) this.lastX = eX;
			if (!this.lastY) this.lastY = eY;    
            for (let i = 0; i < this.selectedGraphics.length; i++) {
                this.getGraphicRenderer(this.selectedGraphics[i]).move(this.selectedGraphics[i], eX, eY, this.lastX, this.lastY)
            }
            this.lastX = eX;
            this.lastY = eY;
            this.clearCanvas();
            this.redraw();
            return;
        }
        if (this.canvas["isPainting"] && this.currentGraphic) {
			this.getGraphicRenderer(this.currentGraphic).invoke(this.currentGraphic, 'mousemove', eX, eY);
			this.redraw();
        }
    }

    private onMouseUp(e: MouseEvent|TouchEvent|any) {
        if (!e || this.isPlaying()) return;

        var eX = e.offsetX;
        var eY = e.offsetY;
        if (!eX || !eY){
            if (e.changedTouches){
                eX = e.changedTouches[0].pageX;
                eY = e.changedTouches[0].pageY;   
            }
            else return;
        }
        
        if (this.isPlaying() && e.type == 'mouseup') {
            this.pause();
            return;
        }
        if (this.isMovingGraphics) {
            this.isMovingGraphics = false;
            this.callback.on('frameUpdated', this.frame.index);
            this.lastX = null;
            this.lastY = null;
            this.clearCanvas();
            this.redraw();
            return;
        }
        if (!this.canvas["isPainting"]) return;
		
        let renderer = this.getGraphicRenderer(this.currentGraphic); 
        renderer.invoke(this.currentGraphic, 'mouseup', eX, eY);
        if (this.currentGraphic && renderer.isValid(this.currentGraphic)) {
            this.frame.layers[0].graphics.push(this.currentGraphic);
            this.frame.modified = true;
			this.callback.on('frameUpdated', this.frame.index);
        }

		this.refresh();
        this.canvas["isPainting"] = false;
    }

    private clearCanvas() {
		// Clears the canvas
		this.context.clearRect(0, 0, this.context.canvas.width, this.context.canvas.height);
		// background color
		this.context.rect(-2, -2, parseInt(this.canvas.getAttribute('width')) + 2, parseInt(this.canvas.getAttribute('height')) + 2);
		this.context.fillStyle = '#ffffff';
		this.context.fill();
    }
    
    private redraw() {
        return this.setFrame(this.frame);
    }

    //////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

    public static randomUid(): string {
        return (("000000" + (Math.random()*Math.pow(36,6) << 0).toString(36)).slice(-6));
    }

    public static hexToRgb(hex: string) {
        // Expand shorthand form (e.g. "03F") to full form (e.g. "0033FF")
        var shorthandRegex = /^#?([a-f\d])([a-f\d])([a-f\d])$/i;
        hex = hex.replace(shorthandRegex, (m, r, g, b) => {
            return r + r + g + g + b + b;
        });
    
        var result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);
        return result ? { r: parseInt(result[1], 16), g: parseInt(result[2], 16), b: parseInt(result[3], 16) } : { r: 0, g: 0, b: 0 };
    }
}

//////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////   

namespace Grafika {
    export const Plugins:Grafika.IPluginFunction[] = [];
    export const VERSION = '0.11.3';

    export const MODE_NONE = 'none', 
                 MODE_PAINT = 'paint', 
                 MODE_MOVE = 'move', 
                 MODE_SELECT = 'select', 
                 MODE_DELETE = 'delete';

    export enum DrawingMode {
        None,
        Paint,
        Move,
        Select,
        Delete
    }

    export enum Events {
        Initialized,
        FrameChanged,
        FrameUpdated,
        Destroyed
    }
    
    export interface IGrafika {
        initialize(any: string, option?: Grafika.IOption, anim?: Grafika.IAnimation);
        destroy();

        getAnimation(): Grafika.IAnimation;
        setAnimation(animation: Grafika.IAnimation);
        saveAnimation();

        play();
        pause();
        isPlaying(): boolean;

        isModified(): boolean;
        save();

        refresh();
        clear();

        getFrame(): Grafika.IFrame;
        getFrames(): Grafika.IFrame[];
        setFrames(frames: Grafika.IFrame[]);
        saveFrame();
        nextFrame();
        previousFrame();
        navigateToFrame(index: number);

        findSelectedGraphics(x: number, y: number): Grafika.IGraphic[];
        getSelectedGraphics(): Grafika.IGraphic[];
        deleteSelectedGraphics();
        getCurrentGraphic(): Grafika.IGraphic;

        getCanvas(): HTMLCanvasElement;
        getCanvasContext(): CanvasRenderingContext2D;
        getOptions(): Grafika.IOption;
        setOptions(options: Grafika.IOption);
        setCallback(callback: Grafika.ICallback);

        getRenderer<TRenderer extends IRenderer<TDrawable>, TDrawable extends IDrawable>(drawableOrType: TDrawable | IDrawable | string): TRenderer;
        getGraphicRenderer<TGraphic extends IGraphic>(graphicOrType: TGraphic | IGraphic | string): IGraphicRenderer<TGraphic>;

        // ---------------------- //
        // exts: IExtension;
        // demo: any;
    }

    export interface ICallback {
        on: (eventName: string, obj?: any) => void;
    }

    export interface IOption {
        backgroundColor?: string;
        foregroundColor?: string;
        brushSize?: number;
        graphic?: string;
        graphicFill?: boolean;
        useCarbonCopy?: boolean;
        useNavigationText?: boolean;
        loop?: boolean;
        drawingMode?: string;
        debugMode?: boolean;
    }
    
    
    /**
     * The animation
     */
    export interface IAnimation extends IDrawable {
        _id: any | string;
        localId: string;

        type: string;
        name: string;
        description: string;

        timer: number;
        width: number;
        height: number;

        dateCreated: number;
        dateModified: number;

        views: number;
        rating: number;
        category: string;

        isPublic: boolean;
        author: string;
        userId: string;

        thumbnailUrl: string;

        totalFrame: number;
        modified: boolean;
        currentFrame: number;
        frames: Grafika.IFrame[];

        // proposed new fields
        client?: any;
    }

    export interface IDrawable {
        type: string;
    }

    export interface IFrame extends IDrawable {
        id: string;
        index: number;
        backgroundColor: string;
        foregroundColor: string;
        backgroundResourceId: string;
        layers: Grafika.ILayer[];
        modified: boolean;
    }

    export interface ILayer extends IDrawable {
        id: string;
        index: number;
        graphics: Grafika.IGraphic[];
    }

    export interface IGraphic extends IDrawable {
        id: string;
        index: number;
        x: number;
        y: number;
        width: number;
        height: number;
        backgroundColor: string;
        foregroundColor: string;
        foregroundAlpha: string;
        isFilled: boolean;
        brushSize: number;
        isVisible: boolean;
    }

    /**
     * Base contract for a resource
     */
    export interface IResource {
        _id: any | string;
        animationId: string;
        mime: string;
    }

    export interface IRenderer<T extends IDrawable> {
        create(drawable?: T): T;
        draw(drawable: T, opts?: any);
        canRender(drawable: T | string | IDrawable): boolean;
    }

    export interface IAnimationRenderer extends IRenderer<Grafika.IAnimation> {

    }

    export interface IFrameRenderer extends IRenderer<Grafika.IFrame> {

    }

    export interface ILayerRenderer extends IRenderer<Grafika.ILayer> {
    }

    export interface IGraphicRenderer<T extends IGraphic> extends IRenderer<T> {
        getBounds(graphic: T): IRectangleBound;
        contains(graphic: T, x: number, y: number): boolean;
        isValid(graphic: T): boolean;
        draw(graphic: T);
        move(graphic: T, x: number, y: number, lastX: number, lastY: number);
        invoke(graphic: T, eventType: string, eventX: number, eventY: number);
    }

    export interface ICanvasData {
        mime: string;
        base64: string;
    }

    export interface IPluginFunction {
        (grafika: IGrafika): IPlugin
    }

    export interface IPlugin {
        name: string,
        version: string
    }

    export interface IRectangleBound {
        x: number;
        y: number;
        width: number;
        height: number;
    }

    export interface IPoint {
        x: number;
        y: number;
    }

/////////////////////////////////////////////////////////////////////////////////////////////////////////
    
    export class Animation implements IAnimation {
        _id: any | string;
        localId: string;

        type: string;
        name: string;
        description: string;

        timer: number;
        width: number;
        height: number;

        dateCreated: number;
        dateModified: number;

        views: number;
        rating: number;
        category: string;

        isPublic: boolean;
        author: string;
        userId: string;

        thumbnailUrl: string;

        totalFrame: number;
        currentFrame: number;
        modified: boolean;
        frames: Grafika.IFrame[];
    }

    export abstract class Renderer<T extends IDrawable> implements IRenderer<T> {
        protected canvas: HTMLCanvasElement;
        protected context: CanvasRenderingContext2D;

        constructor(protected grafika: IGrafika) {
            this.canvas = grafika.getCanvas();
            this.context = grafika.getCanvasContext();
        }

        abstract create(drawable: T): T;
        abstract draw(drawable: T);
        abstract getRenderingType(): string;

        canRender(drawable: T | IDrawable | string): boolean {
            return (drawable && (<IDrawable>drawable).type === this.getRenderingType() || drawable === this.getRenderingType());            
        }
    }

    /////////////////////////////////////////////////////////////////////////////////

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
            anim.frames = anim.frames || [ this.grafika.getRenderer<IFrameRenderer, IFrame>('frame').create() ];
            anim.totalFrame = anim.totalFrame || 0;
            
            anim.currentFrame = anim.currentFrame || 0;
            anim.modified = anim.modified || false;

            return anim;
        }

        draw(animation: Grafika.IAnimation) {
            throw new Error();
        }

        getRenderingType(): string {
            return "animation";
        }
    }

    /////////////////////////////////////////////////////////////////////////////////

    export class FrameRenderer extends Renderer<Grafika.IFrame> implements IFrameRenderer {
        create(frame?: Grafika.IFrame): Grafika.IFrame {
            if (!frame) {
                frame = <Grafika.IFrame> { type: "frame" };
            }

            frame.id = frame.id || Grafika.randomUid();
            frame.index = (frame.index >= 0 ? frame.index : (this.grafika.getAnimation().currentFrame || 0));
            frame.modified = frame.modified || false;
            frame.backgroundResourceId = frame.backgroundResourceId || undefined;
            frame.backgroundColor = frame.backgroundColor || this.grafika.getOptions().backgroundColor;
            frame.foregroundColor = frame.foregroundColor || this.grafika.getOptions().foregroundColor;
            frame.layers = frame.layers || [ this.grafika.getRenderer<ILayerRenderer, ILayer>('layer').create() ];
            frame.type = "frame";

            return frame;
        }

        draw(frame: Grafika.IFrame, opts?: any) {
            // selected graphics
            let selectedGraphics = this.grafika.getSelectedGraphics();
            let animation = this.grafika.getAnimation();
            let options = this.grafika.getOptions();
            let currentGraphic = this.grafika.getCurrentGraphic();
            let layerRenderer = this.grafika.getRenderer<ILayerRenderer, ILayer>("layer");
            
            for (var i = 0; i < selectedGraphics.length; i++) {
                let g = selectedGraphics[i];
                let renderer = this.grafika.getGraphicRenderer(g);
                let rect = renderer.getBounds(g);
                let offset = g.brushSize / 2;
                
                this.context.lineWidth = 2;
                this.context.setLineDash([2,4 ]);
                if (frame.backgroundColor != '#000000')
                    this.context.strokeStyle = 'rgba(0, 0, 0, 0.5)';
                else this.context.strokeStyle = 'rgba(255, 255, 255, 0.6)';
                this.context.strokeRect(rect.x - offset - 2, rect.y - offset - 2, rect.width + (offset * 2) + 4, rect.height + (offset * 2) + 4);
            }        
            // previous frame
            if (options.useCarbonCopy && animation.currentFrame > 0){
                var previousFrame = animation.frames[animation.currentFrame - 1];
                if (previousFrame){
                    for (var li = 0; li < previousFrame.layers.length; li++) {
                        layerRenderer.draw(previousFrame.layers[li], { useCarbonCopy: true });
                    }
                }
            }
            // current frame
            for (var i = 0; i < frame.layers.length; i++) {
                layerRenderer.draw(frame.layers[i]);
            }
            
            if (currentGraphic) {
                let renderer = this.grafika.getGraphicRenderer(currentGraphic);
                renderer.draw(currentGraphic);
            }
        }

        getRenderingType(): string {
            return "frame";
        }

    }

    export class LayerRenderer extends Renderer<Grafika.ILayer> implements ILayerRenderer {
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

        draw(layer: Grafika.ILayer, opts?: any){
            let g: IGraphic;
            this.context.setLineDash([]);
            this.context.lineJoin = "round";
            this.context.lineCap = "round";
            for(let i = 0; i < layer.graphics.length; i++) {
                g = layer.graphics[i];
                if (opts && opts.useCarbonCopy) {
                    var rgb = Grafika.hexToRgb(g.foregroundColor);
                    g.foregroundAlpha = 'rgba(' + rgb.r + ',' + rgb.g + ',' + rgb.b + ', 0.2)';
                }
                
                this.grafika.getGraphicRenderer(g).draw(g);
                
                delete g.foregroundAlpha;
            }
        }

        getRenderingType(): string {
            return "layer";
        }

    }

    /////////////////////////////////////////////////////////////////////////////////

    export namespace Graphics {
        export interface IFreeform extends IGraphic {
            points: IPoint[];
        }

        export interface ILine extends IGraphic {
            endX: number;
            endY: number;
        }

        export interface IRectangle extends IGraphic {
        }

        export interface ISquare extends IRectangle {
        }

        export interface ICircle extends IRectangle {
            radius: number;
        }

        export interface IOval extends ICircle {
            radiusY: number;
        }

        export interface ITriangle extends IRectangle {
        }

        export interface IText extends IRectangle {
            text: string;
            font: string;
            fontWeight: string;
        }
    }

    export namespace Renderers {

        export abstract class GraphicRenderer<T extends IGraphic> extends Renderer<T> implements IGraphicRenderer<T> {
            constructor(grafika: Grafika.IGrafika){
                super(grafika);
            }

            create(graphic?: T): T {
                if (!graphic) 
                    graphic = <T> { type: this.getRenderingType() };

                graphic.id = graphic.id || (("0000" + (Math.random()*Math.pow(36,4) << 0).toString(36)).slice(-4));
                graphic.x = graphic.x || 0;
                graphic.y = graphic.y || 0;
                graphic.width = graphic.width || 10;
                graphic.height = graphic.height || 10;
                graphic.backgroundColor = graphic.backgroundColor || "#ffffff";
                graphic.foregroundColor = graphic.foregroundColor || "#000000";
                graphic.foregroundAlpha = graphic.foregroundAlpha || undefined;
                graphic.isFilled = (typeof graphic.isFilled !== 'undefined' && graphic.isFilled != null) ? graphic.isFilled : false;
                graphic.isVisible = (typeof graphic.isVisible !== 'undefined' && graphic.isVisible != null) ? graphic.isVisible : true;
                graphic.brushSize = graphic.brushSize || 2;
                graphic.type = graphic.type || undefined;

                return graphic;
            }

            abstract getBounds(graphic: T): IRectangleBound;
            abstract contains(graphic: T, x: number, y: number): boolean;
            abstract isValid(graphic: T): boolean;
            
            draw(graphic: T) {
                this.context.lineWidth = graphic.brushSize > 1 ? graphic.brushSize : 1;
                this.context.strokeStyle = graphic.foregroundAlpha || graphic.foregroundColor;
                this.context.fillStyle = graphic.foregroundAlpha || graphic.foregroundColor;	
                this.onDraw(graphic);
            }

            move(graphic: T, x: number, y: number, lastX: number, lastY: number){
		        this.onMove(graphic, x, y, lastX, lastY);
            }
            
            invoke(graphic: T, eventType: string, eventX: number, eventY: number){
                this.onEvent(graphic, eventType, eventX, eventY);
            }

            abstract onDraw(graphic: T);
            abstract onMove(graphic: T, x: number, y: number, lastX: number, lastY: number);
            abstract onEvent(graphic: T, eventType: string, eventX: number, eventY: number);
        }

        export abstract class ShapeRenderer<T extends IGraphic> extends GraphicRenderer<T> {
            getBounds(graphic: T): IRectangleBound {
                return {
                    x: graphic.width > 0 ? graphic.x : graphic.x + graphic.width,
                    y: graphic.height > 0 ? graphic.y : graphic.y + graphic.height,
                    width: Math.abs(graphic.width),
                    height: Math.abs(graphic.height)
                }
            }
            contains(graphic: T, x: number, y: number): boolean {
                let bounds = this.getBounds(graphic);
                return bounds.x < x && bounds.x + bounds.width > x && bounds.y < y && bounds.y + bounds.height > y;
            }
            isValid(graphic: T): boolean {
		        return Math.abs(graphic.width) > 20 && Math.abs(graphic.height) > 20;
            }

            abstract onDraw(graphic: T);
            abstract onMove(graphic: T, x: number, y: number, lastX: number, lastY: number);
            abstract onEvent(graphic: T, eventType: string, eventX: number, eventY: number);
        }

        export class FreeformRenderer extends ShapeRenderer<Grafika.Graphics.IFreeform> {
            create(graphic?: Grafika.Graphics.IFreeform): Grafika.Graphics.IFreeform {
                graphic = super.create(graphic);
                graphic.points = graphic.points || [];

                return graphic;
            }

            getBounds(graphic: Grafika.Graphics.IFreeform): IRectangleBound {
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

            isValid(graphic: Grafika.Graphics.IFreeform): boolean {
                let rect = this.getBounds(graphic);
                return rect.width > 5 || rect.height > 5;
            }

            onDraw(graphic: Grafika.Graphics.IFreeform) {
                this.context.beginPath();
                this.context.moveTo(graphic.x, graphic.y);
                for (let i = 0; i < graphic.points.length; i++) {
                    let point = graphic.points[i];
                    this.context.lineTo(point.x, point.y);
                }
                
                if (graphic.isFilled)
                    this.context.fill();
                else this.context.stroke();
            }
            
            onMove(graphic: Grafika.Graphics.IFreeform, x: number, y: number, lastX: number, lastY: number){
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
            
            onEvent(graphic: Grafika.Graphics.IFreeform, eventType: string, eventX: number, eventY: number){
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

        export class LineRenderer extends ShapeRenderer<Grafika.Graphics.ILine> {
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
                }
            }

            isValid(graphic: Grafika.Graphics.ILine): boolean {
		        return Math.abs(graphic.endX - graphic.x) > 20 || Math.abs(graphic.endY - graphic.y) > 20;
            }

            onDraw(graphic: Grafika.Graphics.ILine) {
                this.context.moveTo(graphic.x, graphic.y);
                this.context.lineTo(graphic.endX, graphic.endY);
                this.context.stroke();
            }
            
            onMove(graphic: Grafika.Graphics.ILine, x: number, y: number, lastX: number, lastY: number){
                // implemented: don't touch (08/27/2015)
                graphic.x = graphic.x + (x - lastX);
                graphic.y = graphic.y + (y - lastY);
                graphic.endX = graphic.endX + (x - lastX);
                graphic.endY = graphic.endY + (y - lastY);
            }
            
            onEvent(graphic: Grafika.Graphics.ILine, eventType: string, eventX: number, eventY: number){
                switch (eventType) {
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

        export class RectangleRenderer<T extends Grafika.Graphics.IRectangle> extends ShapeRenderer<Grafika.Graphics.IRectangle> {  
            onDraw(graphic: Grafika.Graphics.IRectangle) {
                if (graphic.isFilled)
                    this.context.fillRect(graphic.x, graphic.y, graphic.width, graphic.height);
                else {
                    this.context.strokeRect(graphic.x, graphic.y, graphic.width, graphic.height);
                }
            }
            
            onMove(graphic: Grafika.Graphics.IRectangle, x: number, y: number, lastX: number, lastY: number){
                graphic.x = graphic.x + (x - lastX);
                graphic.y = graphic.y + (y - lastY);
            }
            
            onEvent(graphic: Grafika.Graphics.IRectangle, eventType: string, eventX: number, eventY: number){
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
            onEvent(graphic: Grafika.Graphics.ISquare, eventType: string, eventX: number, eventY: number){
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
                }
            }

            isValid(graphic: T): boolean {
		        return graphic.radius > 5;
            }

            onDraw(graphic: T) {
                this.context.beginPath();
                this.context.arc(graphic.x, graphic.y, graphic.radius, 0, 2 * Math.PI);
                if (graphic.isFilled)
                    this.context.fill();
                else
                    this.context.stroke();
            }
            
            onEvent(graphic: T, eventType: string, eventX: number, eventY: number){
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
                }
            }

            isValid(graphic: Grafika.Graphics.IOval): boolean {
		        return graphic.radius > 10 && graphic.radiusY > 10;
            }            

            onDraw(graphic: Grafika.Graphics.IOval) {
                this.context.beginPath();
                (<any> this.context).ellipse(graphic.x, graphic.y, graphic.radius, graphic.radiusY, 0, 0, 2 * Math.PI);
                if (graphic.isFilled)
                    this.context.fill();
                else this.context.stroke();
            }
            
            onEvent(graphic: Grafika.Graphics.IOval, eventType: string, eventX: number, eventY: number){
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
            onDraw(graphic: Grafika.Graphics.ITriangle) {
                this.context.beginPath();
                this.context.moveTo(graphic.x + (graphic.width/2), graphic.y);
                this.context.lineTo(graphic.x, graphic.y + graphic.height);
                this.context.lineTo(graphic.x + graphic.width, graphic.y + graphic.height);
                this.context.closePath();
                if (graphic.isFilled)
                    this.context.fill();
                else this.context.stroke();
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

            onDraw(graphic: Grafika.Graphics.IText) {
                this.context.font = graphic.height + 'px ' + graphic.font;
                if (graphic.isFilled) {
                    this.context.fillStyle = graphic.foregroundAlpha || graphic.foregroundColor;
                    this.context.fillText(graphic.text, graphic.x, graphic.y + graphic.height);
                }
                else {
                    this.context.strokeStyle = graphic.foregroundAlpha || graphic.foregroundColor;
                    this.context.strokeText(graphic.text, graphic.x, graphic.y + graphic.height);
                }
            }
            
            onEvent(graphic: Grafika.Graphics.IText, eventType: string, eventX: number, eventY: number){
                switch (eventType) {
                    case "mouseup": 
                        graphic.text = this.prompt('Insert text');
                        this.drawFocusRectangle(graphic);
                        
                        this.draw(graphic);
                        break;
                }
            } 

            drawFocusRectangle(graphic: Grafika.Graphics.IText) {
                let rect = this.context.measureText(graphic.text);
                graphic.width = rect.width;
                this.context.lineWidth = 1;
                this.context.setLineDash([2,4]);
                this.context.strokeStyle = graphic.foregroundColor;
                this.context.rect(graphic.x, graphic.y, graphic.width, graphic.height);		
            }

            prompt(text:string, title?:string) {
                return window.prompt(text, title);
            }

            getRenderingType(): string {
                return "text";
            }
        }
        
        ////////////////////////////////////////////////////////
    }
} 