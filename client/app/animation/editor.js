(function (angular, app){
	app.controller('AnimationEditorController', function($rootScope, $stateParams, animationService, frameService) {
		var vm = this;
		vm.grafika = new Grafika();
		
		animationService.get($stateParams._id).then(function (res) {
			vm.grafika.initialize('#canvas', { drawingMode: 'paint' }, res.data);
			frameService.get(vm.grafika.getAnimation()).then(function (res) {
				vm.grafika.setFrames(res.data);
			})
		});

		vm.save = function() {
			vm.grafika.save();
			animationService.update(vm.grafika.getAnimation());
			frameService.update(vm.grafika.getAnimation(), vm.grafika.getFrames());
		}
	});
})(window.angular, window.angular.app);