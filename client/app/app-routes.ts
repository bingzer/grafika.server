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
					templateUrl: 'app/layout/home.html'
				})
				.state('login', {
					url: '/login',
					templateUrl: 'app/account/login.html',
					controller: 'LoginController',
					controllerAs: 'vm'
				})
				.state('profile', {
					url: '/profile',
					templateUrl: 'app/account/profile.html',
					controller: 'ProfileController',
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
				.state('drawing', {
					url: '/animations/:_id/drawing',
					templateUrl: 'app/animation/drawing.html',
					controller: 'AnimationDrawingController',
					controllerAs: 'vm'
				});
			$urlRouterProvider.otherwise('/');
			$locationProvder.html5Mode(true);
		}
	}
}