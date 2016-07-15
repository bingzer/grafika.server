(function (plugins){
	function ext(grafika){
		var ext = {
			name: 'Extensions',
			version: '1.0.0',
			imageQuality: 100
		}
		
		ext.copyFrameToNext = function(){
			grafika.saveFrame();
			
			var nextIndex = grafika.getAnimation().currentFrame + 1;
			var cloned = JSON.parse(JSON.stringify(grafika.getFrame()));
			cloned.index = nextIndex;
			cloned.id = grafika.randomUid();
			
			grafika.getAnimation().frames[nextIndex] = cloned;
			grafika.navigateToFrame(nextIndex);
			grafika.log('Frame copied to next frame');
		}
    
		ext.downloadAnimation = function(){
			grafika.saveFrame();
			window.open("data:text/json;charset=utf-8," + JSON.stringify(grafika.getAnimation()));
		}

		ext.downloadFrameAsImage = function(){
			grafika.saveFrame();
			window.open("data:image/png;base64," + ext.getCanvasData().base64);
		}
		
		ext.getCanvasBlob = function() {
		    var oldOptions = captureOldOptions();

			var binary = atob(grafika.getCanvas().toDataURL("image/png", ext.imageQuality).split(',')[1]);
			var array = [];
			for(var i = 0; i < binary.length; i++) {
				array.push(binary.charCodeAt(i));
			}
			grafika.setOptions(oldOptions);

			return new Blob([new Uint8Array(array)], {type: 'image/png'});
		}

		ext.getCanvasData = function() {
		    var oldOptions = captureOldOptions();

			// data:image/png;base64,<base64>
			var rawData = grafika.getCanvas().toDataURL("image/png", ext.imageQuality);
			var mime = rawData.substring(rawData.indexOf("data:") + "data:".length, rawData.indexOf(";"));

			grafika.setOptions(oldOptions);
            return {
                mime: mime,
                base64: rawData.substring(rawData.indexOf(",") + ",".length)
            }
		}

		function captureOldOptions(){
		    grafika.saveFrame();
		    var options = {
		        useNavigationText : grafika.getOptions().useNavigationText,
		        useCarbonCopy: grafika.getOptions().useCarbonCopy,
		        drawingMode: grafika.getOptions.drawingMode
		    };
			grafika.setOptions({ useNavigationText: false, useCarbonCopy: false, drawingMode: 'none' });

		    return options;
		}

		grafika.exts = ext;
		return ext;
	}
	plugins.push(ext);
}(Grafika.Plugins))