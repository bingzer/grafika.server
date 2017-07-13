declare namespace Grafika {
    interface IGrafika extends ILogSource {
        initialize(any: string, option?: Grafika.IOption, anim?: Grafika.IAnimation): void;
        destroy(): void;
        getAnimation(): Grafika.IAnimation;
        setAnimation(animation: Grafika.IAnimation): any;
        saveAnimation(animation?: Grafika.IAnimation): any;
        getScale(): Grafika.IScale;
        play(): void;
        pause(): void;
        isPlaying(): boolean;
        isModified(): boolean;
        save(): void;
        addResource(res: IResource): void;
        hasResource(resId: string): boolean;
        getResource(resId: string): IResource;
        deleteResource(resId: string): void;
        getResources(): IResource[];
        refreshFrame(refreshOptions?: IRefreshFrameOptions): void;
        getFrame(): Grafika.IFrame;
        getFrames(): Grafika.IFrame[];
        setFrames(frames: Grafika.IFrame[]): any;
        setFrameBackground(resource: Grafika.IResource | Grafika.IBackgroundColorResource | string): void;
        clearFrame(): void;
        saveFrame(): void;
        nextFrame(): void;
        previousFrame(): void;
        navigateToFrame(index: number): void;
        findSelectedGraphics(x: number, y: number): Grafika.IGraphic[];
        getSelectedGraphics(): Grafika.IGraphic[];
        deleteSelectedGraphics(): void;
        copySelectedGraphics(): void;
        pasteSelectedGraphics(): void;
        findGraphic(id: string | Grafika.IGraphic): Grafika.IGraphic;
        selectGraphic(id: string | Grafika.IGraphic): Grafika.IGraphic;
        deleteGraphic(id: string | Grafika.IGraphic): Grafika.IGraphic;
        getCurrentGraphic(): Grafika.IGraphic;
        getCanvas(): HTMLCanvasElement;
        getCanvasContext(): CanvasRenderingContext2D;
        getOptions(): Grafika.IOption;
        setOptions(options: Grafika.IOption): void;
        setCallback(callback: Grafika.ICallback): void;
        registerRenderer<TDrawable extends IDrawable>(renderer: IRenderer<TDrawable>): IRenderer<TDrawable>;
        getRenderer<TRenderer extends IRenderer<TDrawable>, TDrawable extends IDrawable>(drawableOrType: TDrawable | IDrawable | string): TRenderer;
        getResourceRenderer<TResource extends IResource>(resOrResId: TResource | IResource | string): IResourceRenderer<TResource>;
        getGraphicRenderer<TGraphic extends IGraphic>(graphicOrType: TGraphic | IGraphic | string): IGraphicRenderer<TGraphic>;
        canUndo(): void;
        canRedo(): void;
        undo(): void;
        redo(): void;
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
        navigationTextX?: number;
        navigationTextY?: number;
        loop?: boolean;
        drawingMode?: string;
        debugMode?: boolean;
    }
    interface IDrawable {
        type: string;
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
        resources: IResource[];
        client?: IClient;
    }
    interface IResource extends IDrawable {
        id: any | string;
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
    interface ICanvasData {
        mime: string;
        base64: string;
    }
    interface ICanvasBlob {
        mime: string;
        blob: Blob;
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
    interface IScale extends IPoint {
    }
    interface IClient {
        name?: string;
        version: string;
        browser: string;
    }
    interface IAction {
        event: string;
        undo(): any;
        redo(): any;
    }
    interface IRefreshFrameOptions {
        keepCurrentGraphic?: boolean;
        keepSelectedGraphics?: boolean;
        drawBackground?: boolean;
    }
    interface ICommandManager {
        clearActions(): any;
        addAction(action: IAction): any;
        canUndo(): boolean;
        canRedo(): boolean;
        undo(): any;
        redo(): any;
    }
    interface IRenderer<T extends IDrawable> {
        create(drawable?: T): T;
        canRender(drawable: T | string | IDrawable): boolean;
        draw(context: CanvasRenderingContext2D, drawable: T): any;
    }
    interface IAnimationRenderer extends IRenderer<Grafika.IAnimation> {
    }
    interface IFrameRenderer extends IRenderer<Grafika.IFrame> {
        drawBackground(context: CanvasRenderingContext2D, frame: Grafika.IFrame, callback?: OnResourceLoaded): any;
        draw(context: CanvasRenderingContext2D, frame: Grafika.IFrame): any;
        drawLayers(context: CanvasRenderingContext2D, frame: Grafika.IFrame, options: {
            carbonCopy?: boolean;
        }): any;
    }
    interface ILayerRenderer extends IRenderer<Grafika.ILayer> {
        draw(context: CanvasRenderingContext2D, drawable: Grafika.ILayer, options?: {
            carbonCopy?: boolean;
        }): any;
    }
    interface IResourceRenderer<TResource extends IResource> extends IRenderer<TResource> {
        draw(context: CanvasRenderingContext2D, resource: TResource, callback?: OnResourceLoaded): any;
    }
    interface IGraphicRenderer<T extends IGraphic> extends IRenderer<T> {
        getBounds(graphic: T): IRectangleBound;
        contains(graphic: T, x: number, y: number): boolean;
        isValid(graphic: T): boolean;
        draw(context: CanvasRenderingContext2D, graphic: T): any;
        move(context: CanvasRenderingContext2D, graphic: T, x: number, y: number, lastX: number, lastY: number): any;
        invoke(context: CanvasRenderingContext2D, graphic: T, eventType: string, eventX: number, eventY: number): any;
    }
    interface ILogSource {
        getName(): any;
        isLogEnabled(): any;
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
    interface OnResourceLoaded {
        (error?: Error, resource?: IResource): any;
    }
    interface IBackgroundLayerResource extends IResource {
        id: string;
        graphics: IGraphic[];
    }
    interface IBackgroundColorResource extends IResource {
        id: string;
        backgroundColor: string;
    }
    interface IBackgroundImageResource extends IResource {
        id: string;
        mime: string;
        base64?: string;
        url?: string;
    }
}
