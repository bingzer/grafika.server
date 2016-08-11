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
			$locationProvder: ng.ILocationProvider,
			$controller: ng.IControllerService
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
					controllerAs: 'vm',
					data: {
						pageTitle: 'Login'
					}
				})
				.state('profile', {
					url: '/profile',
					templateUrl: 'app/account/profile.html',
					controller: 'ProfileController',
					controllerAs: 'vm',
					data: {
						pageTitle: 'Profile'
					}
				})
				.state('settings', {
					url: '/settings',
					templateUrl: 'app/account/settings.html',
					controller: 'SettingsController',
					controllerAs: 'vm',
					data: {
						pageTitle: 'Settings'
					}
				})
				.state('my-animations', {
					url: '/animations/mine',
					templateUrl: 'app/animation/mine.html',
					controller: 'MyAnimationsController',
					controllerAs: 'vm',
					data: {
						pageTitle: 'My Animation'
					}
				})
				.state('admin', {
					url: '/admin',
					templateUrl: 'app/admin/admin.html',
					controller: 'MyAnimationsController',
					controllerAs: 'vm',
					data: {
						pageTitle: 'Grafika Administration'
					}
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
				})
				.state('user', {
					url: '/users/:_id',
					templateUrl: 'app/users/user.html',
					controller: 'UserController',
					controllerAs: 'vm'
				});
			$urlRouterProvider.otherwise('/');
			$locationProvder.html5Mode(true);
		}
	}
}