(function (angular, app){
	app.config(function ($stateProvider, $urlRouterProvider, $locationProvider, $mdThemingProvider) {
		$stateProvider
			.state('home', {
				url: '/',
				templateUrl: 'app/layout/home.html',
				controller: 'HomeController',
				controllerAs: 'vm'
			})
			.state('login', {
				url: '/login',
				templateUrl: 'app/account/login.html',
				controller: 'LoginController',
				controllerAs: 'vm'
			})
			.state('verify', {
				url: '/account/verify',
				templateUrl: 'app/account/verify.html',
				controller: 'VerifyController',
				controllerAs: 'vm'
			})
			.state('my-animations', {
				url: '/animations/mine',
				templateUrl: 'app/animation/mine.html',
				controller: 'MyAnimationsController',
				controllerAs: 'vm'
			})
			.state('detail', {
				url: '/animations/:_id',
				templateUrl: 'app/animation/detail.html',
				controller: 'AnimationDetailController',
				controllerAs: 'vm'
			})
			.state('editor', {
				url: '/animations/:_id/edit',
				templateUrl: 'app/animation/editor.html',
				controller: 'AnimationEditorController',
				controllerAs: 'vm'
			});
		$urlRouterProvider.otherwise('/');
		$locationProvider.html5Mode(true);
	});
})(window.angular, window.angular.app);