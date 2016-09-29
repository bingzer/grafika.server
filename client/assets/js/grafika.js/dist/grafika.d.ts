declare class Grafika implements Grafika.IGrafika {
    private version;
    private animation;
    private frame;
    private selectedGraphics;
    private isMovingGraphics;
    private currentGraphic;
    private animator;
    private options;
    private canvas;
    private context;
    private lastX;
    private lastY;
    private callback;
    private plugins;
    private renderers;
    private animRenderer;
    private frameRenderer;
    private layerRenderer;
    constructor();
    initialize(canvasId: string, opts?: Grafika.IOption, anim?: Grafika.IAnimation): void;
    destroy(): void;
    getAnimation(): Grafika.IAnimation;
    setAnimation(anim: Grafika.IAnimation): void;
    saveAnimation(): void;
    play(): void;
    pause(): void;
    isPlaying(): boolean;
    isModified(): boolean;
    save(): void;
    getFrame(): Grafika.IFrame;
    getFrames(): Grafika.IFrame[];
    setFrames(frames: Grafika.IFrame[]): void;
    saveFrame(): void;
    nextFrame(): void;
    previousFrame(): void;
    navigateToFrame(index: number): void;
    findSelectedGraphics(x: number, y: number): Grafika.IGraphic[];
    getSelectedGraphics(): Grafika.IGraphic[];
    deleteSelectedGraphics(): void;
    getCurrentGraphic(): Grafika.IGraphic;
    getOptions(): Grafika.IOption;
    getCanvas(): HTMLCanvasElement;
    getCanvasContext(): CanvasRenderingContext2D;
    setCallback(callback: Grafika.ICallback): void;
    setOptions(opts: Grafika.IOption): void;
    refresh(): void;
    clear(): void;
    getRenderer<TRenderer extends Grafika.IRenderer<TDrawable>, TDrawable extends Grafika.IDrawable>(drawableOrType: TDrawable | Grafika.IDrawable | string): TRenderer;
    getGraphicRenderer<TGraphic extends Grafika.IGraphic>(graphicOrType: TGraphic | Grafika.IGraphic | string): Grafika.IGraphicRenderer<TGraphic>;
    log(...optionalParams: any[]): void;
    private validateCanvas(canvasId);
    private navigateTo(idx, save);
    private setFrame(fr, clear?);
    private onMouseDown(e);
    private onMouseMove(e);
    private onMouseUp(e);
    private clearCanvas();
    private redraw();
    static randomUid(): string;
    static hexToRgb(hex: string): {
        r: number;
        g: number;
        b: number;
    };
}
declare namespace Grafika {
    const Plugins: Grafika.IPluginFunction[];
    const VERSION: string;
    const MODE_NONE: string, MODE_PAINT: string, MODE_MOVE: string, MODE_SELECT: string, MODE_DELETE: string;
    enum DrawingMode {
        None = 0,
        Paint = 1,
        Move = 2,
        Select = 3,
        Delete = 4,
    }
    enum Events {
        Initialized = 0,
        FrameChanged = 1,
        FrameUpdated = 2,
        Destroyed = 3,
    }
    interface IGrafika {
        initialize(any: string, option?: Grafika.IOption, anim?: Grafika.IAnimation): any;
        destroy(): any;
        getAnimation(): Grafika.IAnimation;
        setAnimation(animation: Grafika.IAnimation): any;
        saveAnimation(): any;
        play(): any;
        pause(): any;
        isPlaying(): boolean;
        isModified(): boolean;
        save(): any;
        refresh(): any;
        clear(): any;
        getFrame(): Grafika.IFrame;
        getFrames(): Grafika.IFrame[];
        setFrames(frames: Grafika.IFrame[]): any;
        saveFrame(): any;
        nextFrame(): any;
        previousFrame(): any;
        navigateToFrame(index: number): any;
        findSelectedGraphics(x: number, y: number): Grafika.IGraphic[];
        getSelectedGraphics(): Grafika.IGraphic[];
        deleteSelectedGraphics(): any;
        getCurrentGraphic(): Grafika.IGraphic;
        getCanvas(): HTMLCanvasElement;
        getCanvasContext(): CanvasRenderingContext2D;
        getOptions(): Grafika.IOption;
        setOptions(options: Grafika.IOption): any;
        setCallback(callback: Grafika.ICallback): any;
        getRenderer<TRenderer extends IRenderer<TDrawable>, TDrawable extends IDrawable>(drawableOrType: TDrawable | IDrawable | string): TRenderer;
        getGraphicRenderer<TGraphic extends IGraphic>(graphicOrType: TGraphic | IGraphic | string): IGraphicRenderer<TGraphic>;
    }
    interface ICallback {
        on: (eventName: string, obj?: any) => void;
    }
    interface IOption {
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
    interface IAnimation extends IDrawable {
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
        client?: any;
    }
    interface IDrawable {
        type: string;
    }
    interface IFrame extends IDrawable {
        id: string;
        index: number;
        backgroundColor: string;
        foregroundColor: string;
        backgroundResourceId: string;
        layers: Grafika.ILayer[];
        modified: boolean;
    }
    interface ILayer extends IDrawable {
        id: string;
        index: number;
        graphics: Grafika.IGraphic[];
    }
    interface IGraphic extends IDrawable {
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
    interface IResource {
        _id: any | string;
        animationId: string;
        mime: string;
    }
    interface IRenderer<T extends IDrawable> {
        create(drawable?: T): T;
        draw(drawable: T, opts?: any): any;
        canRender(drawable: T | string | IDrawable): boolean;
    }
    interface IAnimationRenderer extends IRenderer<Grafika.IAnimation> {
    }
    interface IFrameRenderer extends IRenderer<Grafika.IFrame> {
    }
    interface ILayerRenderer extends IRenderer<Grafika.ILayer> {
    }
    interface IGraphicRenderer<T extends IGraphic> extends IRenderer<T> {
        getBounds(graphic: T): IRectangleBound;
        contains(graphic: T, x: number, y: number): boolean;
        isValid(graphic: T): boolean;
        draw(graphic: T): any;
        move(graphic: T, x: number, y: number, lastX: number, lastY: number): any;
        invoke(graphic: T, eventType: string, eventX: number, eventY: number): any;
    }
    interface ICanvasData {
        mime: string;
        base64: string;
    }
    interface IPluginFunction {
        (grafika: IGrafika): IPlugin;
    }
    interface IPlugin {
        name: string;
        version: string;
    }
    interface IRectangleBound {
        x: number;
        y: number;
        width: number;
        height: number;
    }
    interface IPoint {
        x: number;
        y: number;
    }
    class Animation implements IAnimation {
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
    abstract class Renderer<T extends IDrawable> implements IRenderer<T> {
        protected grafika: IGrafika;
        protected canvas: HTMLCanvasElement;
        protected context: CanvasRenderingContext2D;
        constructor(grafika: IGrafika);
        abstract create(drawable: T): T;
        abstract draw(drawable: T): any;
        abstract getRenderingType(): string;
        canRender(drawable: T | IDrawable | string): boolean;
    }
    class AnimationRenderer extends Renderer<Grafika.IAnimation> implements IAnimationRenderer {
        create(anim?: Grafika.IAnimation): Grafika.IAnimation;
        draw(animation: Grafika.IAnimation): void;
        getRenderingType(): string;
    }
    class FrameRenderer extends Renderer<Grafika.IFrame> implements IFrameRenderer {
        create(frame?: Grafika.IFrame): Grafika.IFrame;
        draw(frame: Grafika.IFrame, opts?: any): void;
        getRenderingType(): string;
    }
    class LayerRenderer extends Renderer<Grafika.ILayer> implements ILayerRenderer {
        constructor(grafika: IGrafika);
        create(layer?: Grafika.ILayer): Grafika.ILayer;
        draw(layer: Grafika.ILayer, opts?: any): void;
        getRenderingType(): string;
    }
    namespace Graphics {
        interface IFreeform extends IGraphic {
            points: IPoint[];
        }
        interface ILine extends IGraphic {
            endX: number;
            endY: number;
        }
        interface IRectangle extends IGraphic {
        }
        interface ISquare extends IRectangle {
        }
        interface ICircle extends IRectangle {
            radius: number;
        }
        interface IOval extends ICircle {
            radiusY: number;
        }
        interface ITriangle extends IRectangle {
        }
        interface IText extends IRectangle {
            text: string;
            font: string;
            fontWeight: string;
        }
    }
    namespace Renderers {
        abstract class GraphicRenderer<T extends IGraphic> extends Renderer<T> implements IGraphicRenderer<T> {
            constructor(grafika: Grafika.IGrafika);
            create(graphic?: T): T;
            abstract getBounds(graphic: T): IRectangleBound;
            abstract contains(graphic: T, x: number, y: number): boolean;
            abstract isValid(graphic: T): boolean;
            draw(graphic: T): void;
            move(graphic: T, x: number, y: number, lastX: number, lastY: number): void;
            invoke(graphic: T, eventType: string, eventX: number, eventY: number): void;
            abstract onDraw(graphic: T): any;
            abstract onMove(graphic: T, x: number, y: number, lastX: number, lastY: number): any;
            abstract onEvent(graphic: T, eventType: string, eventX: number, eventY: number): any;
        }
        abstract class ShapeRenderer<T extends IGraphic> extends GraphicRenderer<T> {
            getBounds(graphic: T): IRectangleBound;
            contains(graphic: T, x: number, y: number): boolean;
            isValid(graphic: T): boolean;
            abstract onDraw(graphic: T): any;
            abstract onMove(graphic: T, x: number, y: number, lastX: number, lastY: number): any;
            abstract onEvent(graphic: T, eventType: string, eventX: number, eventY: number): any;
        }
        class FreeformRenderer extends ShapeRenderer<Grafika.Graphics.IFreeform> {
            create(graphic?: Grafika.Graphics.IFreeform): Grafika.Graphics.IFreeform;
            getBounds(graphic: Grafika.Graphics.IFreeform): IRectangleBound;
            isValid(graphic: Grafika.Graphics.IFreeform): boolean;
            onDraw(graphic: Grafika.Graphics.IFreeform): void;
            onMove(graphic: Grafika.Graphics.IFreeform, x: number, y: number, lastX: number, lastY: number): void;
            onEvent(graphic: Grafika.Graphics.IFreeform, eventType: string, eventX: number, eventY: number): void;
            getRenderingType(): string;
        }
        class LineRenderer extends ShapeRenderer<Grafika.Graphics.ILine> {
            create(graphic?: Grafika.Graphics.ILine): Grafika.Graphics.ILine;
            getBounds(graphic: Grafika.Graphics.ILine): IRectangleBound;
            isValid(graphic: Grafika.Graphics.ILine): boolean;
            onDraw(graphic: Grafika.Graphics.ILine): void;
            onMove(graphic: Grafika.Graphics.ILine, x: number, y: number, lastX: number, lastY: number): void;
            onEvent(graphic: Grafika.Graphics.ILine, eventType: string, eventX: number, eventY: number): void;
            getRenderingType(): string;
        }
        class RectangleRenderer<T extends Grafika.Graphics.IRectangle> extends ShapeRenderer<Grafika.Graphics.IRectangle> {
            onDraw(graphic: Grafika.Graphics.IRectangle): void;
            onMove(graphic: Grafika.Graphics.IRectangle, x: number, y: number, lastX: number, lastY: number): void;
            onEvent(graphic: Grafika.Graphics.IRectangle, eventType: string, eventX: number, eventY: number): void;
            getRenderingType(): string;
        }
        class SquareRenderer extends RectangleRenderer<Grafika.Graphics.ISquare> {
            onEvent(graphic: Grafika.Graphics.ISquare, eventType: string, eventX: number, eventY: number): void;
            getRenderingType(): string;
        }
        class CircleRenderer<T extends Grafika.Graphics.ICircle> extends RectangleRenderer<T> {
            create(graphic?: Grafika.Graphics.ICircle): Grafika.Graphics.ICircle;
            getBounds(graphic: T): IRectangleBound;
            isValid(graphic: T): boolean;
            onDraw(graphic: T): void;
            onEvent(graphic: T, eventType: string, eventX: number, eventY: number): void;
            getRenderingType(): string;
        }
        class OvalRenderer extends CircleRenderer<Grafika.Graphics.IOval> {
            create(graphic?: Grafika.Graphics.IOval): Grafika.Graphics.IOval;
            getBounds(graphic: Grafika.Graphics.IOval): IRectangleBound;
            isValid(graphic: Grafika.Graphics.IOval): boolean;
            onDraw(graphic: Grafika.Graphics.IOval): void;
            onEvent(graphic: Grafika.Graphics.IOval, eventType: string, eventX: number, eventY: number): void;
            getRenderingType(): string;
        }
        class TriangleRenderer extends RectangleRenderer<Grafika.Graphics.ITriangle> {
            onDraw(graphic: Grafika.Graphics.ITriangle): void;
            getRenderingType(): string;
        }
        class TextRenderer extends RectangleRenderer<Grafika.Graphics.IText> {
            create(graphic?: Grafika.Graphics.IText): Grafika.Graphics.IText;
            isValid(graphic: Grafika.Graphics.IText): boolean;
            onDraw(graphic: Grafika.Graphics.IText): void;
            onEvent(graphic: Grafika.Graphics.IText, eventType: string, eventX: number, eventY: number): void;
            drawFocusRectangle(graphic: Grafika.Graphics.IText): void;
            prompt(text: string, title?: string): string;
            getRenderingType(): string;
        }
    }
}
