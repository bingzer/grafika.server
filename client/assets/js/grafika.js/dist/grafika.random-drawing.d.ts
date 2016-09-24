declare namespace Grafika {
    interface IGrafika {
        random?: Grafika.IRandomDrawingPlugin;
    }
    interface IRandomDrawingPlugin extends IPlugin {
        initialize(frameCount: number, graphicCount: number): any;
    }
}
