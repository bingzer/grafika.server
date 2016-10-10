declare namespace Grafika {
    interface IGrafika {
        exts?: Grafika.IExtensions;
        animation?: Grafika.IAnimation;
        frame?: Grafika.IFrame;
    }
    interface IExtensions extends IPlugin {
        clearFrame(): any;
        deleteFrame(): any;
        copyFrameToNext(): any;
        copyFrameToPrevious(): any;
        insertFrameAfter(): any;
        insertFrameBefore(): any;
        deleteSelectedGraphics(): any;
        downloadAnimation(): any;
        downloadFrameAsImage(): any;
        getCanvasBlob(): any;
        getCanvasData(): any;
    }
}
