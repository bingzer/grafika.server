declare namespace Grafika {
    interface IGrafika {
        exts?: Grafika.IExtensions;
        animation?: Grafika.IAnimation;
        frames?: Grafika.IFrame[];
        frame?: Grafika.IFrame;
        callback?: Grafika.ICallback;
        contextBackground?: CanvasRenderingContext2D;
    }
    interface IExtensions extends IPlugin {
        clearFrame(): any;
        deleteFrame(): any;
        copyFrameToNext(): any;
        copyFrameToPrevious(): any;
        insertFrameAfter(): any;
        insertFrameBefore(): any;
        getFrameProperty(propertyName: string): any;
        deleteSelectedGraphics(): any;
        copySelectedGraphics(): any;
        pasteSelectedGraphics(): any;
        downloadAnimation(): any;
        downloadFrameAsImage(): any;
        getCanvasBlob(callback?: (err: Error, data: ICanvasBlob) => void): Grafika.ICanvasBlob;
        getCanvasData(callback?: (err: Error, data: ICanvasData) => void): Grafika.ICanvasData;
    }
}
