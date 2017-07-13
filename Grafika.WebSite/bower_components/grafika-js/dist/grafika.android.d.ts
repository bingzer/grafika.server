declare namespace Grafika {
    interface IGrafika {
        android?: Grafika.IAndroid;
        animation?: Grafika.IAnimation;
        frames?: Grafika.IFrame[];
        frame?: Grafika.IFrame;
        callback?: Grafika.ICallback;
        contextBackground?: CanvasRenderingContext2D;
    }
    interface IAndroid extends IPlugin, ICallback, ILogSource {
        loadFrameData(animOrAnimId: Grafika.IAnimation | string): any;
    }
}
declare namespace GrafikaAndroid {
    function invoke(event: any, obj: any): any;
}
