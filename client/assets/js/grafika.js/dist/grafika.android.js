(function (plugins){
	function androidApi(grafika){
		var api = {
			name: 'Android Api',
			version: '1.0.0'
		}

		api.on = function(event, obj) {
		    console.log('[GrafikaAndroid] ' + event + ' : ' + obj);
            if (!GrafikaAndroid)
                throw new Error('GrafikaAndroid is not yet activated');
		    GrafikaAndroid.invoke(event, obj + "");

		    switch (event) {
		        case "animationSaved":
		            if (grafika.getAnimation().client) {
		                grafika.getAnimation().client.name = 'Grafika Android';
		            }
		            break;
		    }
		}
		
		if (typeof GrafikaAndroid !== 'undefined')
			grafika.setCallback(api);
		
		return api;
	}
	plugins.push(androidApi);
}(Grafika.Plugins))