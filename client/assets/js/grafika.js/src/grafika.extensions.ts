namespace Grafika {
    export interface IGrafika {
        exts?: Grafika.IExtensions;
    }

    export interface IExtensions extends IPlugin {
        copyFrameToNext();
        downloadAnimation();
        downloadFrameAsImage();
        getCanvasBlob();
        getCanvasData();
    }
}

/////////////////////////////////////////////////////////////////////////

Grafika.Plugins.push((grafika: Grafika.IGrafika) => {
    
    class GrafikaExtensions implements Grafika.IExtensions {
        name = 'Extensions';
        version = '1.0.0';
        imageQuality = 100;

        constructor(private grafika: Grafika.IGrafika) {
            // nothing
        }
        
        copyFrameToNext(){
            this.grafika.saveFrame();
            
            let nextIndex = this.grafika.getAnimation().currentFrame + 1;
            let cloned = JSON.parse(JSON.stringify(this.grafika.getFrame(), this.getJSONReplacer()));
            cloned.index = nextIndex;
            cloned.id = this.randomUid();

            let frameRenderer = this.grafika.getRenderer<Grafika.FrameRenderer, Grafika.IFrame>('frame');
            
            this.grafika.getAnimation().frames[nextIndex] = frameRenderer.create(cloned);
            this.grafika.navigateToFrame(nextIndex);
            this.log('Frame copied to next frame');
        }
        
		downloadAnimation(){
			grafika.saveFrame();
			window.open("data:text/json;charset=utf-8," + JSON.stringify(grafika.getAnimation(), this.getJSONReplacer()));
		}

		downloadFrameAsImage(){
			grafika.saveFrame();
			window.open("data:image/png;base64," + this.getCanvasData().base64);
		}
		
		getCanvasBlob() {
		    var oldOptions = this.captureOldOptions();

			var binary = atob(grafika.getCanvas().toDataURL("image/png", this.imageQuality).split(',')[1]);
			var array = [];
			for(var i = 0; i < binary.length; i++) {
				array.push(binary.charCodeAt(i));
			}
			grafika.setOptions(oldOptions);

			return new Blob([new Uint8Array(array)], {type: 'image/png'});
		}

		getCanvasData() {
		    var oldOptions = this.captureOldOptions();

			// data:image/png;base64,<base64>
			var rawData = grafika.getCanvas().toDataURL("image/png", this.imageQuality);
			var mime = rawData.substring(rawData.indexOf("data:") + "data:".length, rawData.indexOf(";"));

			grafika.setOptions(oldOptions);
            return {
                mime: mime,
                base64: rawData.substring(rawData.indexOf(",") + ",".length)
            }
		}

        private randomUid() {
            return (("000000" + (Math.random()*Math.pow(36,6) << 0).toString(36)).slice(-6));
        }

        private log(msg) {
            console.log('[GrafikaExt] ' + msg);
        }

		private captureOldOptions(){
		    grafika.saveFrame();
		    var options = {
		        useNavigationText : grafika.getOptions().useNavigationText,
		        useCarbonCopy: grafika.getOptions().useCarbonCopy,
		        drawingMode: grafika.getOptions().drawingMode
		    };
			grafika.setOptions({ useNavigationText: false, useCarbonCopy: false, drawingMode: 'none' });

		    return options;
		}

        private getJSONReplacer(): (key,value) => any {
            return (key, value) => {
                if (key === 'grafika') return undefined;
                else return value;
            }
        }
    }

    return grafika.exts = new GrafikaExtensions(grafika);
});