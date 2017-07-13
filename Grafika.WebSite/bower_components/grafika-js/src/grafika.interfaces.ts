/**
 * All interfaces
 */
namespace Grafika {
    export interface IGrafika extends ILogSource {
        initialize(any: string, option?: Grafika.IOption, anim?: Grafika.IAnimation): void;
        destroy(): void;

        getAnimation(): Grafika.IAnimation;
        setAnimation(animation: Grafika.IAnimation);
        saveAnimation(animation?: Grafika.IAnimation);

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
        setFrames(frames: Grafika.IFrame[]);
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

        findGraphic(id: string| Grafika.IGraphic): Grafika.IGraphic;
        selectGraphic(id: string| Grafika.IGraphic): Grafika.IGraphic;
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

        //getCommandManager(): Grafika.ICommandManager;
        canUndo(): void;
        canRedo(): void;
        undo(): void;
        redo(): void;
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
        navigationTextX?: number,
        navigationTextY?: number,
        loop?: boolean;
        drawingMode?: string;
        debugMode?: boolean;
    }

    export interface IDrawable {
        type: string;
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

        resources: IResource[];

        // proposed new fields
        client?: IClient;
    }

    /**
     * Base contract for a resource
     */
    export interface IResource extends IDrawable {
        id: any | string;
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
    
    export interface ICanvasData {
        mime: string;
        base64: string;
    }

    export interface ICanvasBlob {
        mime: string,
        blob: Blob
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

    export interface IScale extends IPoint {

    }

    //////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

    export interface IClient {
        /**
         * Client name
         */
        name?: string;

        /**
         * Grafika version
         */
        version: string;

        /**
         * Browser
         */
        browser: string;
    }

    export interface IAction {
        event: string;
        undo();
        redo();
    }

    export interface IRefreshFrameOptions {
        keepCurrentGraphic?: boolean; 
        keepSelectedGraphics?: boolean;
        drawBackground?: boolean;
    }

    export interface ICommandManager {
        clearActions();
        addAction(action: IAction);

        canUndo(): boolean;
        canRedo(): boolean;

        undo();
        redo();
    }

    //////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

    export interface IRenderer<T extends IDrawable> {
        create(drawable?: T): T;
        canRender(drawable: T | string | IDrawable): boolean;

        draw(context: CanvasRenderingContext2D, drawable: T);
    }

    export interface IAnimationRenderer extends IRenderer<Grafika.IAnimation> {
    }

    export interface IFrameRenderer extends IRenderer<Grafika.IFrame> {
        drawBackground(context: CanvasRenderingContext2D, frame: Grafika.IFrame, callback?: OnResourceLoaded)
        draw(context: CanvasRenderingContext2D, frame: Grafika.IFrame);
        drawLayers(context: CanvasRenderingContext2D, frame: Grafika.IFrame, options: { carbonCopy?: boolean });
    }

    export interface ILayerRenderer extends IRenderer<Grafika.ILayer> {
        draw(context: CanvasRenderingContext2D, drawable: Grafika.ILayer, options?: { carbonCopy?: boolean });
    }

    export interface IResourceRenderer<TResource extends IResource> extends IRenderer<TResource> {
        draw(context: CanvasRenderingContext2D, resource: TResource, callback?: OnResourceLoaded);
    }

    export interface IGraphicRenderer<T extends IGraphic> extends IRenderer<T> {
        getBounds(graphic: T): IRectangleBound;
        contains(graphic: T, x: number, y: number): boolean;
        isValid(graphic: T): boolean;

        draw(context: CanvasRenderingContext2D, graphic: T);
        move(context: CanvasRenderingContext2D, graphic: T, x: number, y: number, lastX: number, lastY: number);
        invoke(context: CanvasRenderingContext2D, graphic: T, eventType: string, eventX: number, eventY: number);
    } 

    export interface ILogSource {
        getName();
        isLogEnabled();
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

    /////////////////////////////////////////////////////////////////////////////////

    export interface OnResourceLoaded {
        (error ?: Error, resource ?: IResource);
    }

    export interface IBackgroundLayerResource extends IResource {
        id: string;
        graphics: IGraphic[];
    }

    export interface IBackgroundColorResource extends IResource {
        id: string;
        backgroundColor: string;
    }

    export interface IBackgroundImageResource extends IResource {
        id: string;
        mime: string;
        base64?: string;
        url?: string;
    }
}