(function (angular, app){
	app.controller('IntroController', function($rootScope, $mdDialog, appCommon, authService, animationService) {
		var vm = this;
		
		if (!window.grafikaIntro){
			window.grafikaIntro = new Grafika();
		}
		window.grafikaIntro.initialize('#intro-canvas', { drawingMode: 'none', useNavigationText: false, useCarbonCopy: false, loop: true });
		window.grafikaIntro.demo.initialize('alphabet');
		window.grafikaIntro.getAnimation().timer = 500;
		window.grafikaIntro.play();
		
		$rootScope.$on('$stateChangeStart', function (e) {
			window.grafikaIntro.pause();
		});
	});
})(window.angular, window.angular.app);