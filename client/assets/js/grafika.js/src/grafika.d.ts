declare var Grafika;

declare namespace Grafika {
    interface IGrafika {
        initialize(any: string, option?: IOption, anim?: Grafika.IAnimation);

        getAnimation(): Grafika.IAnimation;
        setAnimation(animation: Grafika.IAnimation);
        saveAnimation();

        play();
        pause();
        isPlaying(): boolean;

        isModified(): boolean;
        save();

        getFrame(): Grafika.IFrame;
        getFrames(): [Grafika.IFrame];
        setFrames(frames: [Grafika.IFrame]);
        saveFrame();
        nextFrame();
        previousFrame();
        navigateToFrame(index: number);

        findSelectedGraphics(x: number, y: number): [Grafika.Graphics.IGraphic];
        getSelectedGraphics(): [Grafika.Graphics.IGraphic];
        deleteSelectedGraphics();
        currentGraphic(): Grafika.Graphics.IGraphic;

        setOptions(options: Grafika.IOption);
        setCallback(callback: ICallback);

        exts: IExtension;
    }
    
    /**
     * The animation
     */
    interface IAnimation extends IDrawable {
        _id: any | string;
        localId: string;

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
        frames: [any | Grafika.IFrame];
    }

    interface ICallback {
        on: (eventName: string, obj: any) => void;
    }

    interface IOption {
        backgroundColor?: string;
        foregroundColor?: string;
        brushSize?: number;
        graphic?: string;
        graphicFill?: boolean;
        useCarbonCopy?: boolean;
        useNavigationText?: boolean;
        drawingMode?: string;
        debugMode?: boolean;
    }

    interface IRectangleBound {
        x: number;
        y: number;
        width: number;
        height: number;
    }

    interface IDrawable {
        //randomUid(): string;
    }

    interface IFrame extends IDrawable {
        id: string;
        index: number;
        backgroundColor: string;
        foregroundColor: string;
        layers: [Grafika.ILayer];
    }

    interface ILayer extends IDrawable {
        id: string;
        index: number;
        graphics: [Grafika.Graphics.IGraphic];
    }

    interface IExtension {
        copyFrameToNext(): void;
        downloadAnimation(): void;
        downloadFrameAsImage(): void;
        getCanvasBlob(): Blob;
    }

    interface ICanvasData {
        mime: string;
        base64: string;
    }
}

declare namespace Grafika.Graphics {

    interface IGraphic {
        id: string;
        index: number;
        x: number;
        y: number;
        width: number;
        height: number;
        backgroundColor: string;
        foregroundColor: string;
        isFilled: boolean;
        type: string;
        brushSize: number;
        isVisible: boolean;

        getBounds(): IRectangleBound;
        contains(x: number, y: number): boolean;
        isValid(): boolean;
        draw(context: any | CanvasRenderingContext2D);
        move(context: any | CanvasRenderingContext2D, x: number, y: number, lastX: number, lastY: number);
        invoke(context: any | CanvasRenderingContext2D, eventType: string, eventX: number, eventY: number);
    }
}

declare namespace Grafika.Extensions {
    /*


    */
}

declare module 'Grafika' {
    export = Grafika;
}