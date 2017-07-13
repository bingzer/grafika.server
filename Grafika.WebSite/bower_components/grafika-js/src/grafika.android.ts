declare namespace Grafika {
    export interface IGrafika {
        android?: Grafika.IAndroid;
        animation?: Grafika.IAnimation;
        frames?: Grafika.IFrame[];
        frame?: Grafika.IFrame;
        callback?: Grafika.ICallback;
        contextBackground?: CanvasRenderingContext2D;
    }
    

    export interface IAndroid extends IPlugin, ICallback, ILogSource {
        loadFrameData(animOrAnimId: Grafika.IAnimation | string);
    }
}

declare namespace GrafikaAndroid {
    export function invoke(event, obj);
}

////////////////////////////////////////////////////

Grafika.Plugins.push((grafika) => {
    class GrafikaAndroidPlugin implements Grafika.IPlugin, Grafika.ICallback, Grafika.ILogSource {
        name = 'Android Api';
        version = '1.0.0';
        on = (event, obj) => {
            Grafika.log(this, `${event} + ' : ' + ${obj}`);
            if (!GrafikaAndroid)
                throw new Error('GrafikaAndroid is not yet activated');
            GrafikaAndroid.invoke(event, obj + "");

            switch (event) {
                case "animationSaved":
                    if (this.grafika.getAnimation().client) {
                        this.grafika.getAnimation().client.name = 'Grafika Android';
                    }
                    break;
            }
        }

        constructor(private grafika: Grafika.IGrafika) {
            // nothing
        }

        getName = () => `[${this.name} ${this.version}]`;
        isLogEnabled = () => this.grafika.getOptions().debugMode;
        loadFrameData = (anim: Grafika.IAnimation | string) => {
            var animId = (<Grafika.IAnimation>anim)._id || anim;
            ajax("GET", `grafika://animations/${animId}/frames`, (err, result) => {
                if (err)
                    Grafika.log(this, err.message);
                this.grafika.setFrames(result);
            });
        }
    }
    
    let plugin = new GrafikaAndroidPlugin(grafika);
    if (Grafika.isDefined(typeof GrafikaAndroid))
        grafika.setCallback(plugin);
    return grafika.android = plugin;
    
    function ajax(method: string, url: string, callback: (err: Error, result?: any) => void) {
        var http = new XMLHttpRequest();
        http.onreadystatechange = () => {
            if (http.readyState == XMLHttpRequest.DONE) {
                if (http.status == 200) callback(undefined, JSON.parse(http.responseText));
                else callback(new Error(http.statusText));
            }
        };
        http.open("GET", url, true);
        http.send();
    }
});