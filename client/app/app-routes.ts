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
					templateUrl: 'app/layout/home.html',
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
						pageTitle: 'Profile',
						roles: ['user']
					}
				})
				.state('settings', {
					url: '/settings',
					templateUrl: 'app/account/settings.html',
					controller: 'SettingsController',
					controllerAs: 'vm',
					data: {
						pageTitle: 'Settings',
						roles: ['user']
					}
				})
				.state('my-animations', {
					url: '/animations/mine',
					templateUrl: 'app/animation/mine.html',
					controller: 'MyAnimationsController',
					controllerAs: 'vm',
					data: {
						pageTitle: 'My Animation',
						roles: ['user']
					}
				})
				.state('admin', {
					url: '/admin',
					templateUrl: 'app/admin/admin.html',
					controller: 'AdminController',
					controllerAs: 'vm',
					data: {
						pageTitle: 'Grafika Administration',
						roles: ['administrator']
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
					controllerAs: 'vm',
					data: {
						roles: ['user']
					}
				})
				.state('user', {
					url: '/users/:_id',
					templateUrl: 'app/users/user.html',
					controller: 'UserController',
					controllerAs: 'vm'
				})
				// --- static content ---//
				.state('about', { url: '/about', templateUrl: 'app/content/about.html', data: { pageTitle: 'About Grafika' } })
				.state('feedback', { url: '/feedback', templateUrl: 'app/content/feedback.html', data: { pageTitle: 'Feedback' } })
				.state('privacy', { url: '/privacy', templateUrl: 'app/content/privacy.html', data: { pageTitle: 'Privacy' } })
				.state('eula', { url: '/eula', templateUrl: 'app/content/eula.html', data: { pageTitle: 'EULA' } })
				.state('help', { url: '/help', templateUrl: 'app/content/help.html', data: { pageTitle: 'Help' } })
				;
			$urlRouterProvider.otherwise('/');
			$locationProvder.html5Mode(true);
		}
	}
}