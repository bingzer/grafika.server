namespace Grafika {
    export interface IGrafika {
        random?: Grafika.IRandomDrawingPlugin;
    }

    export interface IRandomDrawingPlugin extends IPlugin {
        initialize(frameCount: number, graphicCount: number);
    }
}

/////////////////////////////////////////////////////////////////////////

Grafika.Plugins.push((grafika) => {
    class GrafikaRandomDrawing implements Grafika.IRandomDrawingPlugin {
        name = 'Random Drawing Test';
        version = '1.0.0';
        that: this;

        constructor(private grafika: Grafika.IGrafika) {
            // nothing
        }

        initialize(frameCount: number = 500, graphicCount: number = 15) {
			let animation = <Grafika.IAnimation> grafika.getRenderer('animation').create();
			animation.timer = 25;
			this.grafika.setAnimation(animation);
			
			for (var i = 0; i < frameCount; i++) {
				var layer = this.grafika.getFrame().layers[0];
				for (var j = 0; j < graphicCount; j++) {
					var graphic = this.drawRandom();				
					layer.graphics.push(graphic);					
				}
				
				this.grafika.nextFrame();
			}
			this.grafika.play();
        }

        private drawRandom() {
			let drawFunctions = [
                () => {
                    let renderer = this.grafika.getRenderer("circle") as Grafika.Renderers.CircleRenderer<Grafika.Graphics.ICircle>;
                    let circle = renderer.create();
                    circle.radius = Math.floor(Math.random() * this.grafika.getAnimation().width) + 1;
                    return circle;
                },
                () => {
                    let pointCount = 10;
                    let renderer = this.grafika.getRenderer("freeform") as Grafika.Renderers.FreeformRenderer;
                    let freeform = renderer.create();
                    for (let i = 0; i < pointCount; i++) {
                        freeform.points.push(this.randomPoint())
                    }
                    
                    return freeform;
                }
			];
			let g = drawFunctions[Math.floor(Math.random()*drawFunctions.length)]();
			let point = this.randomPoint();
			g.x = point.x;
			g.y = point.y;
			return g;
		}
			
		private randomPoint() {
			return {
				x: Math.floor(Math.random() * grafika.getAnimation().width) + 1,
				y: Math.floor(Math.random() * grafika.getAnimation().height) + 1
			};
		}
    }

    return grafika.random = new GrafikaRandomDrawing(grafika);
});