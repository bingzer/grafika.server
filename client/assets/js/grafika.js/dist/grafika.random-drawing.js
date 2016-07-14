(function (plugins){
	function ext(grafika){
		var ext = {
			name: 'Random Drawing Test',
			version: '1.0.0'
		};
		
		ext.initialize = function(count, graphicCount){
			if (!count) count = 500;
			if (!graphicCount) graphicCount = 25;
			
			var animation = new Grafika.Animation(grafika);
			animation.timer = 25;
			grafika.setAnimation(animation);
			
			for (var i = 0; i < count; i++) {
				var layer = grafika.getFrame().layers[0];
				for (var j = 0; j < graphicCount; j++) {
					var graphic = drawRandom(grafika);				
					layer.graphics.push(graphic);					
				}
				
				grafika.nextFrame();
			}
			grafika.play();
		}
		
		function drawRandom(grafika) {
			var drawFunctions = [
				drawCircle,
				drawFreeform
			];
			var g = drawFunctions[Math.floor(Math.random()*drawFunctions.length)](grafika);
			var point = randomPoint();
			g.x = point.x;
			g.y = point.y;
			return g;
		}
		
		function drawCircle(grafika) {
			var circle = new Grafika.Graphics.Circle();
			circle.radius = Math.floor(Math.random() * grafika.getAnimation().width) + 1;
			return circle;
		}
		
		function drawFreeform(grafika) {
			var pointCount = 10;
			var freeform = new Grafika.Graphics.Freeform();
			for (var i = 0; i < pointCount; i++) {
				freeform.points.push(randomPoint())
			}
			
			return freeform;
		}
			
		function randomPoint() {
			return {
				x: Math.floor(Math.random() * grafika.getAnimation().width) + 1,
				y: Math.floor(Math.random() * grafika.getAnimation().height) + 1
			};
		}
		
		grafika.random = ext;
		return ext;
	}
	plugins.push(ext);
}(Grafika.Plugins))