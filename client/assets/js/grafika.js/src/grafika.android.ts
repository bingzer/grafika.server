declare namespace GrafikaAndroid {
    export function invoke(event, obj);
}

////////////////////////////////////////////////////

Grafika.Plugins.push((grafika) => {
    class GrafikaAndroidPlugin implements Grafika.IPlugin, Grafika.ICallback {
        name = 'Android Api';
        version = '1.0.0';
        on = (event, obj) => {
            console.log('[GrafikaAndroid] ' + event + ' : ' + obj);
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
    }
    
    let plugin = new GrafikaAndroidPlugin(grafika);

    if (typeof GrafikaAndroid !== 'undefined')
        grafika.setCallback(plugin);
    return plugin;
});