namespace Grafika {
    export interface IGrafika {
        exts?: Grafika.IExtensions;
        animation?: Grafika.IAnimation;
        frame?: Grafika.IFrame;
    }

    export interface IExtensions extends IPlugin {
        // --- Frames
        clearFrame();
        deleteFrame();
        copyFrameToNext();
        copyFrameToPrevious();
        insertFrameAfter();
        insertFrameBefore();

        // --- Graphics
        deleteSelectedGraphics();

        // --- Misc
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
        frameRenderer: Grafika.IFrameRenderer;

        constructor(private grafika: Grafika.IGrafika) {
            this.frameRenderer = this.grafika.getRenderer<Grafika.IFrameRenderer, Grafika.IFrame>('frame');
        }

        clearFrame() {
            this.grafika.clear();
            this.grafika.saveFrame();
        }

        deleteFrame() {
            let animation = this.grafika.animation;
            let currentIndex = animation.currentFrame;
            if (currentIndex < 0) return;

            animation.frames.splice(currentIndex, 1);
            if (animation.frames.length == 0) {
                animation.frames.push(this.frameRenderer.create());
            }

            if (currentIndex > animation.frames.length - 1)
                currentIndex = animation.frames.length - 1;

            animation.currentFrame = currentIndex;
            this.grafika.frame = animation.frames[animation.currentFrame];
            this.grafika.navigateToFrame(animation.currentFrame);
        }
        
        copyFrameToNext(){
            this.grafika.saveFrame();
            
            let nextIndex = this.grafika.getAnimation().currentFrame + 1;
            let cloned = JSON.parse(JSON.stringify(this.grafika.getFrame(), this.getJSONReplacer()));
            cloned.index = nextIndex;
            cloned.id = this.randomUid();
            
            this.grafika.getAnimation().frames[nextIndex] = this.frameRenderer.create(cloned);
            this.grafika.navigateToFrame(nextIndex);
            this.log('Frame copied to next frame');
            this.grafika.saveFrame();
        }

        copyFrameToPrevious(){
            this.grafika.saveFrame();

            let previousIndex = this.grafika.getAnimation().currentFrame - 1;
            if (previousIndex < 0) return;
            let cloned = JSON.parse(JSON.stringify(this.grafika.getFrame(), this.getJSONReplacer()));
            cloned.index = previousIndex;
            cloned.id = this.randomUid();

            this.grafika.getAnimation().frames[previousIndex] = this.frameRenderer.create(cloned);
            this.grafika.navigateToFrame(previousIndex);
            this.log('Frame copied to previous frame');
            this.grafika.saveFrame();
        }

        insertFrameAfter(){
            this.grafika.saveFrame();

            //.splice(index, 0, item)
            let index = this.grafika.animation.currentFrame;
            let newFrame = this.frameRenderer.create(<Grafika.IFrame> { index: index + 1});
            let currFrame = this.grafika.frame;
            
            this.grafika.animation.frames.splice(index, 0, newFrame);
            this.grafika.animation.frames[index] = currFrame;
            this.grafika.animation.frames[newFrame.index] = newFrame;
            this.grafika.animation.currentFrame = newFrame.index;
            this.grafika.frame = this.grafika.animation.frames[newFrame.index];

            this.grafika.saveFrame();
            this.grafika.navigateToFrame(this.grafika.animation.currentFrame);

            this.log('Frame inserted after current frame');
        }

        insertFrameBefore(){
            this.grafika.saveFrame();

            //.splice(index, 0, item)
            let index = this.grafika.animation.currentFrame;
            if (index < 0) return;

            let newFrame = this.frameRenderer.create(<Grafika.IFrame> { index: index });
            
            this.grafika.animation.frames.splice(index, 0, newFrame);
            this.grafika.frame = this.grafika.animation.frames[index];

            this.grafika.saveFrame();
            this.grafika.navigateToFrame(this.grafika.animation.currentFrame);

            this.log('Frame inserted before current frame');
        }

        ////////////////////////////////////////////////////////////////////////////////////////

        deleteSelectedGraphics() {
            this.grafika.deleteSelectedGraphics();
            this.grafika.saveFrame();
            
            this.log('Selected graphics deleted');
        }

        ////////////////////////////////////////////////////////////////////////////////////////
        
		downloadAnimation(){
			this.grafika.saveFrame();
			window.open("data:text/json;charset=utf-8," + JSON.stringify(this.grafika.getAnimation(), this.getJSONReplacer()));
		}

		downloadFrameAsImage(){
			this.grafika.saveFrame();
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
		    this.grafika.saveFrame();
		    var options = {
		        useNavigationText : this.grafika.getOptions().useNavigationText,
		        useCarbonCopy: this.grafika.getOptions().useCarbonCopy,
		        drawingMode: this.grafika.getOptions().drawingMode
		    };
			this.grafika.setOptions({ useNavigationText: false, useCarbonCopy: false, drawingMode: 'none' });

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