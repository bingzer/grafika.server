module GrafikaApp {

	export class Routes {
		public static $inject = [
			'$stateProvider',
			'$urlRouterProvider',
			'$locationProvider'
		];

		constructor(
			$stateProvider: ng.ui.IStateProvider,
			$urlRouterProvider: ng.ui.IUrlRouterProvider,
			$locationProvder: ng.ILocationProvider
		) {
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
			$locationProvder.html5Mode(true);
		}
	}
}