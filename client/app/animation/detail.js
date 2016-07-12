(function (angular, app){
	app.controller('AnimationDetailController', function($rootScope, $stateParams, animationService, frameService) {
		var vm = this;
		vm.grafika = new Grafika();

		animationService.get($stateParams._id).then(function (res) {
			vm.grafika.initialize('#canvas', { useNavigationText: false, useCarbonCopy: false }, res.data);
			frameService.get(vm.grafika.getAnimation()).then(function (res) {
				vm.grafika.setFrames(res.data);
			})
		});
	});
})(window.angular, window.angular.app);