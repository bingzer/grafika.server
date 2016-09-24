declare namespace Grafika {
    interface IGrafika {
        exts?: Grafika.IExtensions;
    }
    interface IExtensions extends IPlugin {
        copyFrameToNext(): any;
        downloadAnimation(): any;
        downloadFrameAsImage(): any;
        getCanvasBlob(): any;
        getCanvasData(): any;
    }
}
