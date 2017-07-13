declare class Grafika implements Grafika.IGrafika {
    version: string;
    animation: Grafika.IAnimation;
    frames: Grafika.IFrame[];
    frame: Grafika.IFrame;
    selectedGraphics: Grafika.IGraphic[];
    copiedSelectedGraphics: Grafika.IGraphic[];
    renderers: Grafika.IRenderer<Grafika.IDrawable>[];
    callback: Grafika.ICallback;
    contextBackground: CanvasRenderingContext2D;
    context: CanvasRenderingContext2D;
    contextDrawing: CanvasRenderingContext2D;
    private currentGraphic;
    private isPainting;
    private isMovingGraphics;
    private animator;
    private options;
    private canvasWrapper;
    private lastX;
    private lastY;
    private plugins;
    private animRenderer;
    private frameRenderer;
    private layerRenderer;
    private defaultRenderer;
    private scale;
    private commando;
    private graphicBeforeMoving;
    initialize: (canvasId: string, opts?: Grafika.IOption, anim?: Grafika.IAnimation) => void;
    destroy: () => void;
    getAnimation: () => Grafika.IAnimation;
    setAnimation: (anim: Grafika.IAnimation) => void;
    saveAnimation: (anim?: Grafika.IAnimation) => void;
    play: () => void;
    pause: () => void;
    isPlaying: () => boolean;
    isModified: () => boolean;
    save: () => void;
    getScale: () => Grafika.IScale;
    addResource: (resource: Grafika.IResource) => void;
    hasResource: (resId: string) => boolean;
    getResource: (resId: string) => Grafika.IResource;
    deleteResource: (resId: string) => void;
    getResources: () => Grafika.IResource[];
    getLayer: () => Grafika.ILayer;
    refreshFrame: (refreshOptions?: Grafika.IRefreshFrameOptions) => void;
    getFrame: () => Grafika.IFrame;
    getFrames: () => Grafika.IFrame[];
    clearFrame: () => void;
    setFrames: (frames: Grafika.IFrame[]) => void;
    saveFrame: () => void;
    setFrameBackground: (resource: string | Grafika.IResource | Grafika.IBackgroundColorResource) => void;
    nextFrame: () => void;
    previousFrame: () => void;
    navigateToFrame: (index: number) => void;
    findSelectedGraphics: (x: number, y: number) => Grafika.IGraphic[];
    findGraphic: (id: string | Grafika.IGraphic) => Grafika.IGraphic;
    selectGraphic: (id: string | Grafika.IGraphic) => Grafika.IGraphic;
    deleteGraphic: (id: string | Grafika.IGraphic, actionable?: boolean) => Grafika.IGraphic;
    getSelectedGraphics: () => Grafika.IGraphic[];
    deleteSelectedGraphics: (actionable?: boolean) => void;
    copySelectedGraphics: () => void;
    pasteSelectedGraphics: () => void;
    getCurrentGraphic: () => Grafika.IGraphic;
    getOptions: () => Grafika.IOption;
    getCanvas: () => HTMLCanvasElement;
    getCanvasContext: () => CanvasRenderingContext2D;
    setCallback: (callback: Grafika.ICallback) => void;
    setOptions: (opts: Grafika.IOption) => void;
    registerRenderer: <TDrawable extends Grafika.IDrawable>(renderer: Grafika.IRenderer<TDrawable>) => Grafika.IRenderer<TDrawable>;
    getRenderer: <TRenderer extends Grafika.IRenderer<TDrawable>, TDrawable extends Grafika.IDrawable>(drawableOrType: string | Grafika.IDrawable | TDrawable) => TRenderer;
    getResourceRenderer: <TResource extends Grafika.IResource>(resOrResId: string | Grafika.IResource | TResource) => Grafika.IResourceRenderer<TResource>;
    getGraphicRenderer: <TGraphic extends Grafika.IGraphic>(graphicOrType: string | Grafika.IGraphic | TGraphic) => Grafika.IGraphicRenderer<TGraphic>;
    canUndo: () => boolean;
    canRedo: () => boolean;
    undo: () => any;
    redo: () => any;
    getName: () => string;
    isLogEnabled: () => boolean;
    private validateCanvas(canvasId);
    private navigateTo(idx, save);
    private onMouseDown(e);
    private onMouseMove(e);
    private onMouseUp(e);
}
declare namespace Grafika {
    const Plugins: Grafika.IPluginFunction[];
    const VERSION: string;
    const MODE_NONE: string, MODE_PAINT: string, MODE_SELECT: string;
    const EVT_INITIALIZED: string, EVT_DESTROYED: string, EVT_PLAYING: string, EVT_ANIMATION_SAVED: string, EVT_FRAME_COUNT: string, EVT_FRAME_UPDATED: string, EVT_FRAME_CHANGED: string, EVT_FRAME_SAVED: string, EVT_GRAPHIC_CREATED: string, EVT_GRAPHIC_SELECTED: string, EVT_GRAPHIC_MOVED: string, EVT_GRAPHIC_COPIED: string, EVT_GRAPHIC_PASTED: string, EVT_GRAPHIC_DELETED: string;
    class DefaultOption implements Grafika.IOption {
        backgroundColor: string;
        foregroundColor: string;
        brushSize: number;
        graphic: string;
        graphicFill: boolean;
        useCarbonCopy: boolean;
        useNavigationText: boolean;
        navigationTextX: number;
        navigationTextY: number;
        debugMode: boolean;
        drawingMode: string;
        loop: boolean;
    }
    class DefaultCallback implements Grafika.ICallback {
        private grafika;
        constructor(grafika: IGrafika);
        on: (eventName: any, obj: any) => void;
    }
}
declare namespace Grafika {
    abstract class Renderer<T extends IDrawable> implements IRenderer<T> {
        protected grafika: IGrafika;
        constructor(grafika: IGrafika);
        abstract draw(context: CanvasRenderingContext2D, drawable: T): any;
        abstract create(drawable: T): T;
        abstract getRenderingType(): string;
        canRender(drawable: T | IDrawable | string): boolean;
    }
    class DefaultRenderer extends Renderer<Grafika.IDrawable> implements IResourceRenderer<Grafika.IResource>, IRenderer<Grafika.IDrawable> {
        create(drawable: Grafika.IDrawable): any;
        draw(context: CanvasRenderingContext2D, drawable: Grafika.IDrawable): void;
        getRenderingType(): string;
        canRender(drawable: Grafika.IDrawable | string): boolean;
    }
    class AnimationRenderer extends Renderer<Grafika.IAnimation> implements IAnimationRenderer {
        create(anim?: Grafika.IAnimation): Grafika.IAnimation;
        draw(context: CanvasRenderingContext2D, drawable: IAnimation): void;
        getRenderingType(): string;
    }
    class FrameRenderer extends Renderer<Grafika.IFrame> implements IFrameRenderer {
        private backgroundColorRenderer;
        private backgroundImageRenderer;
        private backgroundLayerRenderer;
        private layerRenderer;
        constructor(grafika: Grafika);
        create(frame?: Grafika.IFrame): Grafika.IFrame;
        draw(context: CanvasRenderingContext2D, frame: Grafika.IFrame): void;
        drawBackground(context: CanvasRenderingContext2D, frame: Grafika.IFrame, callback: Grafika.OnResourceLoaded): void;
        drawLayers(context: CanvasRenderingContext2D, frame: Grafika.IFrame, options?: {
            carbonCopy?: boolean;
        }): void;
        getRenderingType(): string;
    }
    class LayerRenderer extends Renderer<ILayer> implements ILayerRenderer {
        constructor(grafika: IGrafika);
        create(layer?: Grafika.ILayer): Grafika.ILayer;
        draw(context: CanvasRenderingContext2D, layer: Grafika.ILayer, options?: {
            carbonCopy?: boolean;
        }): void;
        getRenderingType(): string;
    }
    abstract class ResourceRenderer<T extends IResource> extends Renderer<T> implements IResourceRenderer<T> {
        create(resource?: T): T;
        abstract draw(context: CanvasRenderingContext2D, resource: T, callback?: Grafika.OnResourceLoaded): any;
    }
    class BackgroundLayerRenderer extends ResourceRenderer<Grafika.IBackgroundLayerResource> {
        create(resource?: Grafika.IBackgroundLayerResource): IBackgroundLayerResource;
        draw(context: CanvasRenderingContext2D, resource: Grafika.IBackgroundLayerResource, callback?: Grafika.OnResourceLoaded): void;
        getRenderingType(): string;
    }
    class BackgroundColorRenderer extends ResourceRenderer<Grafika.IBackgroundColorResource> {
        create(resource?: Grafika.IBackgroundColorResource): IBackgroundColorResource;
        draw(context: CanvasRenderingContext2D, resource: Grafika.IBackgroundColorResource, callback?: Grafika.OnResourceLoaded): void;
        getRenderingType(): string;
    }
    class BackgroundImageRenderer extends ResourceRenderer<Grafika.IBackgroundImageResource> {
        create(resource?: Grafika.IBackgroundImageResource): IBackgroundImageResource;
        draw(context: CanvasRenderingContext2D, resource: Grafika.IBackgroundImageResource, callback?: Grafika.OnResourceLoaded): void;
        getRenderingType(): string;
        private from(resource, callback?);
        private fromBase64(resource);
        private fromUrl(resource);
    }
    abstract class GraphicRenderer<T extends IGraphic> extends Renderer<T> implements IGraphicRenderer<T> {
        constructor(grafika: Grafika.IGrafika);
        create(graphic?: T): T;
        getBounds(graphic: T): IRectangleBound;
        contains(graphic: T, x: number, y: number): boolean;
        isValid(graphic: T): boolean;
        draw(context: CanvasRenderingContext2D, graphic: T): void;
        move(context: CanvasRenderingContext2D, graphic: T, x: number, y: number, lastX: number, lastY: number): void;
        invoke(context: CanvasRenderingContext2D, graphic: T, eventType: string, eventX: number, eventY: number): void;
        abstract onDraw(context: CanvasRenderingContext2D, graphic: T): any;
        abstract onMove(context: CanvasRenderingContext2D, graphic: T, x: number, y: number, lastX: number, lastY: number): any;
        abstract onEvent(context: CanvasRenderingContext2D, graphic: T, eventType: string, eventX: number, eventY: number): any;
    }
    class FreeformRenderer extends GraphicRenderer<Grafika.Graphics.IFreeform> {
        point: IPoint;
        create(graphic?: Grafika.Graphics.IFreeform): Grafika.Graphics.IFreeform;
        calculateBounds(graphic: Grafika.Graphics.IFreeform): IRectangleBound;
        getBounds(graphic: Grafika.Graphics.IFreeform): IRectangleBound;
        isValid(graphic: Grafika.Graphics.IFreeform): boolean;
        onDraw(context: CanvasRenderingContext2D, graphic: Grafika.Graphics.IFreeform): void;
        onMove(context: CanvasRenderingContext2D, graphic: Grafika.Graphics.IFreeform, x: number, y: number, lastX: number, lastY: number): void;
        onEvent(context: CanvasRenderingContext2D, graphic: Grafika.Graphics.IFreeform, eventType: string, eventX: number, eventY: number): void;
        getRenderingType(): string;
    }
    class LineRenderer extends GraphicRenderer<Grafika.Graphics.ILine> {
        create(graphic?: Grafika.Graphics.ILine): Grafika.Graphics.ILine;
        getBounds(graphic: Grafika.Graphics.ILine): IRectangleBound;
        isValid(graphic: Grafika.Graphics.ILine): boolean;
        onDraw(context: CanvasRenderingContext2D, graphic: Grafika.Graphics.ILine): void;
        onMove(context: CanvasRenderingContext2D, graphic: Grafika.Graphics.ILine, x: number, y: number, lastX: number, lastY: number): void;
        onEvent(context: CanvasRenderingContext2D, graphic: Grafika.Graphics.ILine, eventType: string, eventX: number, eventY: number): void;
        getRenderingType(): string;
    }
    class RectangleRenderer<T extends Grafika.Graphics.IRectangle> extends GraphicRenderer<Grafika.Graphics.IRectangle> {
        onDraw(context: CanvasRenderingContext2D, graphic: Grafika.Graphics.IRectangle): void;
        onMove(context: CanvasRenderingContext2D, graphic: Grafika.Graphics.IRectangle, x: number, y: number, lastX: number, lastY: number): void;
        onEvent(context: CanvasRenderingContext2D, graphic: Grafika.Graphics.IRectangle, eventType: string, eventX: number, eventY: number): void;
        getRenderingType(): string;
    }
    class SquareRenderer extends RectangleRenderer<Grafika.Graphics.ISquare> {
        onEvent(context: CanvasRenderingContext2D, graphic: Grafika.Graphics.ISquare, eventType: string, eventX: number, eventY: number): void;
        getRenderingType(): string;
    }
    class CircleRenderer<T extends Grafika.Graphics.ICircle> extends RectangleRenderer<T> {
        create(graphic?: Grafika.Graphics.ICircle): Grafika.Graphics.ICircle;
        getBounds(graphic: T): IRectangleBound;
        isValid(graphic: T): boolean;
        onDraw(context: CanvasRenderingContext2D, graphic: T): void;
        onEvent(context: CanvasRenderingContext2D, graphic: T, eventType: string, eventX: number, eventY: number): void;
        getRenderingType(): string;
    }
    class OvalRenderer extends CircleRenderer<Grafika.Graphics.IOval> {
        create(graphic?: Grafika.Graphics.IOval): Grafika.Graphics.IOval;
        getBounds(graphic: Grafika.Graphics.IOval): IRectangleBound;
        isValid(graphic: Grafika.Graphics.IOval): boolean;
        onDraw(context: CanvasRenderingContext2D, graphic: Grafika.Graphics.IOval): void;
        onEvent(context: CanvasRenderingContext2D, graphic: Grafika.Graphics.IOval, eventType: string, eventX: number, eventY: number): void;
        getRenderingType(): string;
    }
    class TriangleRenderer extends RectangleRenderer<Grafika.Graphics.ITriangle> {
        onDraw(context: CanvasRenderingContext2D, graphic: Grafika.Graphics.ITriangle): void;
        getRenderingType(): string;
    }
    class TextRenderer extends RectangleRenderer<Grafika.Graphics.IText> {
        create(graphic?: Grafika.Graphics.IText): Grafika.Graphics.IText;
        isValid(graphic: Grafika.Graphics.IText): boolean;
        onDraw(context: CanvasRenderingContext2D, graphic: Grafika.Graphics.IText): void;
        onEvent(context: CanvasRenderingContext2D, graphic: Grafika.Graphics.IText, eventType: string, eventX: number, eventY: number): void;
        drawFocusRectangle(context: CanvasRenderingContext2D, graphic: Grafika.Graphics.IText): void;
        prompt(text: string, title?: string): string;
        getRenderingType(): string;
    }
}
declare namespace Grafika {
    class CommandManager implements ICommandManager {
        private grafika;
        undoActions: Grafika.IAction[];
        redoActions: Grafika.IAction[];
        constructor(grafika: IGrafika);
        clearActions: () => void;
        addAction: (action: IAction) => void;
        canUndo: () => boolean;
        canRedo: () => boolean;
        undo: () => void;
        redo: () => void;
    }
    abstract class GraphicAction implements IAction {
        grafika: Grafika;
        graphic: IGraphic;
        event: string;
        constructor(grafika: IGrafika, graphic: IGraphic, event: string);
        undo: () => void;
        redo: () => void;
        getRenderer: () => IGraphicRenderer<IGraphic>;
        abstract performUndo(): any;
        abstract performRedo(): any;
    }
    class GraphicCreated extends GraphicAction {
        constructor(grafika: IGrafika, graphic: IGraphic);
        performUndo(): void;
        performRedo(): void;
    }
    class GraphicDeleted extends GraphicAction {
        constructor(grafika: IGrafika, graphic: IGraphic);
        performUndo(): void;
        performRedo(): void;
    }
    class GraphicMoved extends GraphicAction {
        private previous;
        constructor(grafika: IGrafika, graphic: IGraphic, previous: IGraphic);
        performUndo(): void;
        performRedo(): void;
    }
    class GraphicPasted extends GraphicCreated {
        constructor(grafika: IGrafika, graphic: IGraphic);
    }
}
declare namespace Grafika {
    function isDefined(any: any): boolean;
    function isUndefined(any: any): boolean;
    function log(src: ILogSource, ...optionalParams: string[]): void;
    function randomUid(prefix?: string): string;
    function hexToRgb(hex: string): {
        r: number;
        g: number;
        b: number;
    };
    function calculateCoordinates(scale: IScale, e: MouseEvent | TouchEvent | any): Grafika.IPoint;
    function calculateFurthestDistance(x: number, y: number, graphic: Grafika.IGraphic): number;
    function clearCanvas(context: CanvasRenderingContext2D): void;
    function clone<T>(any: T): T;
}
