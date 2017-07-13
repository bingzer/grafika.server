namespace Grafika {
    export interface IGrafika {
        exts?: Grafika.IExtensions;
        animation?: Grafika.IAnimation;
        frames?: Grafika.IFrame[];
        frame?: Grafika.IFrame;
        callback?: Grafika.ICallback;
        contextBackground?: CanvasRenderingContext2D;
    }

    export interface IExtensions extends IPlugin {
        // --- Frames
        clearFrame();
        deleteFrame();
        copyFrameToNext();
        copyFrameToPrevious();
        insertFrameAfter();
        insertFrameBefore();
        getFrameProperty(propertyName: string): any;

        // --- Graphics
        deleteSelectedGraphics();
        copySelectedGraphics();
        pasteSelectedGraphics();

        // --- Misc
        downloadAnimation();
        downloadFrameAsImage();
        getCanvasBlob(callback?: (err: Error, data: ICanvasBlob) => void): Grafika.ICanvasBlob;
        getCanvasData(callback?: (err: Error, data: ICanvasData) => void): Grafika.ICanvasData;
    }
}

/////////////////////////////////////////////////////////////////////////

Grafika.Plugins.push((grafika: Grafika.IGrafika) => {
    class GrafikaExtensions implements Grafika.IExtensions, Grafika.ILogSource {
        name = 'Extensions';
        version = '1.0.0';
        imageQuality = 100;
        frameRenderer: Grafika.IFrameRenderer;

        constructor(private grafika: Grafika.IGrafika) {
            this.frameRenderer = this.grafika.getRenderer<Grafika.IFrameRenderer, Grafika.IFrame>('frame');
        }

        getName = () => `[${this.name} ${this.version}]`;
        isLogEnabled = () => this.grafika.getOptions().debugMode;

        clearFrame = () => {
            this.grafika.clearFrame();
            this.grafika.saveFrame();
        }
        deleteFrame = () => {
            let animation = this.grafika.animation;
            let currentIndex = animation.currentFrame;
            if (currentIndex < 0) return;

            this.grafika.frames.splice(currentIndex, 1);
            if (this.grafika.frames.length == 0) {
                this.grafika.frames.push(this.frameRenderer.create());
            }

            if (currentIndex > this.grafika.frames.length - 1)
                currentIndex = this.grafika.frames.length - 1;

            animation.currentFrame = currentIndex;
            this.grafika.frame = this.grafika.frames[animation.currentFrame];
            this.grafika.navigateToFrame(animation.currentFrame);
        }
        
        copyFrameToNext = () =>{
            this.grafika.saveFrame();
            
            let nextIndex = this.grafika.getAnimation().currentFrame + 1;
            let cloned = JSON.parse(JSON.stringify(this.grafika.getFrame(), this.getJSONReplacer()));
            cloned.index = nextIndex;
            cloned.id = Grafika.randomUid();
            
            this.grafika.frames[nextIndex] = this.frameRenderer.create(cloned);
            this.grafika.navigateToFrame(nextIndex);
            this.grafika.saveFrame();
            
            Grafika.log(this, 'Frame copied to next frame');
        }

        copyFrameToPrevious = () =>{
            this.grafika.saveFrame();

            let previousIndex = this.grafika.getAnimation().currentFrame - 1;
            if (previousIndex < 0) return;
            let cloned = JSON.parse(JSON.stringify(this.grafika.getFrame(), this.getJSONReplacer()));
            cloned.index = previousIndex;
            cloned.id = Grafika.randomUid();

            this.grafika.frames[previousIndex] = this.frameRenderer.create(cloned);
            this.grafika.navigateToFrame(previousIndex);
            this.grafika.saveFrame();
            
            Grafika.log(this, 'Frame copied to previous frame');
        }

        insertFrameAfter = () =>{
            this.grafika.saveFrame();

            //.splice(index, 0, item)
            let index = this.grafika.animation.currentFrame;
            let newFrame = this.frameRenderer.create(<Grafika.IFrame> { index: index + 1});
            let currFrame = this.grafika.frame;
            
            this.grafika.frames.splice(index, 0, newFrame);
            this.grafika.frames[index] = currFrame;
            this.grafika.frames[newFrame.index] = newFrame;
            this.grafika.animation.currentFrame = newFrame.index;
            this.grafika.frame = this.grafika.frames[newFrame.index];

            this.grafika.saveFrame();
            this.grafika.navigateToFrame(this.grafika.animation.currentFrame);

            Grafika.log(this, 'Frame inserted after current frame');
        }

        insertFrameBefore = () =>{
            this.grafika.saveFrame();

            //.splice(index, 0, item)
            let index = this.grafika.animation.currentFrame;
            if (index < 0) return;

            let newFrame = this.frameRenderer.create(<Grafika.IFrame> { index: index });
            
            this.grafika.frames.splice(index, 0, newFrame);
            this.grafika.frame = this.grafika.frames[index];

            this.grafika.saveFrame();
            this.grafika.navigateToFrame(this.grafika.animation.currentFrame);

            Grafika.log(this, 'Frame inserted before current frame');
        }

        getFrameProperty = (propertyName: string) => this.grafika.frame[propertyName];

        ////////////////////////////////////////////////////////////////////////////////////////

        deleteSelectedGraphics = () => {
            this.grafika.deleteSelectedGraphics();
            this.grafika.saveFrame();
            
            Grafika.log(this, 'Selected graphics deleted');
        }

        copySelectedGraphics = () => {
            this.grafika.copySelectedGraphics();
            Grafika.log(this, 'Selected graphics copied');
        }

        pasteSelectedGraphics = () => {
            this.grafika.pasteSelectedGraphics();
            this.grafika.saveFrame();

            Grafika.log(this, 'Selected graphics pasted');
        }

        ////////////////////////////////////////////////////////////////////////////////////////
        
		downloadAnimation = () =>{
			this.grafika.saveFrame();
			window.open("data:application/json;charset=utf-8," + JSON.stringify(this.grafika.getAnimation(), this.getJSONReplacer()));
		}

		downloadFrameAsImage = () =>{
			this.grafika.saveFrame();
            this.getCanvasData((err, data) => {
                if (err) console.error(err);
			    else window.open("data:image/png;base64," + data.base64);
            });
		}
		
		getCanvasBlob = (callback: (err: Error, blob: Grafika.ICanvasBlob) => void): Grafika.ICanvasBlob => {
            let error: Error = undefined;
            let canvasBlob: Grafika.ICanvasBlob = undefined;
		    let oldOptions = this.captureOldOptions();
            let frameRenderer = this.grafika.getRenderer<Grafika.IFrameRenderer, Grafika.IFrame>("frame");

            frameRenderer.drawBackground(this.grafika.contextBackground, this.grafika.getFrame(), (err, resource) => {
                frameRenderer.draw(this.grafika.contextBackground, this.grafika.getFrame());
                
                error = err;
                try {
                    var binary = atob(this.grafika.contextBackground.canvas.toDataURL("image/png", this.imageQuality).split(',')[1]);
                    var array = [];
                    for(var i = 0; i < binary.length; i++) {
                        array.push(binary.charCodeAt(i));
                    }

                    this.grafika.setOptions(oldOptions);
                    canvasBlob = { mime: "image/png", blob: new Blob([new Uint8Array(array)]) };
                }
                catch (e) {
                    error = e;
                }

                if (callback) callback(error, canvasBlob);
            });

            if (!callback) {
                let wait = setInterval(() => {
                    if (Grafika.isDefined(error) || Grafika.isDefined(canvasBlob)) {
                        clearInterval(wait);
                    }
                }, 100);
            }

            return canvasBlob;
		}

		getCanvasData = (callback: (err: Error, data: Grafika.ICanvasData) => void): Grafika.ICanvasData => {
            let error: Error = undefined;
            let canvasData: Grafika.ICanvasData = undefined;
		    let oldOptions = this.captureOldOptions();
            let frameRenderer = this.grafika.getRenderer<Grafika.IFrameRenderer, Grafika.IFrame>("frame");

            frameRenderer.drawBackground(this.grafika.contextBackground, this.grafika.getFrame(), (err, resource) => {
                frameRenderer.draw(this.grafika.contextBackground, this.grafika.getFrame());

                error = err;
                try {
                    // data:image/png;base64,<base64>
                    var rawData = this.grafika.contextBackground.canvas.toDataURL("image/png", this.imageQuality);
                    var mime = rawData.substring(rawData.indexOf("data:") + "data:".length, rawData.indexOf(";"));

                    this.grafika.setOptions(oldOptions);
                    this.grafika.refreshFrame({ drawBackground: true })
                    canvasData = { mime: mime, base64: rawData.substring(rawData.indexOf(",") + ",".length) };
                }
                catch (e) {
                    error = e;
                }

                if (callback) callback(error, canvasData);
            });

            if (!callback) {
                let wait = setInterval(() => {
                    if (Grafika.isDefined(error) || Grafika.isDefined(canvasData)) {
                        clearInterval(wait);
                    }
                }, 100);
            }

            return canvasData;
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