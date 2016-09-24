declare namespace Grafika {
    interface IGrafika {
        demo?: Grafika.IDemo;
    }
    interface IDemo extends IPlugin {
        initialize(name: string, width: number, height: number): any;
    }
}
