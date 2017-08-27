module GrafikaApp {
    export module Drawing {

        export class AppRoutes {
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
                    .state('drawing', {
                        url: '/:_id',
                        templateUrl: '/js/drawing/drawing.html',
                        data: {
                            roles: ['user']
                        }
                    })
                    .state('drawingBackground', {
                        url: '/backgrounds/:_id',
                        templateUrl: 'app/background/drawing.html',
                        controller: 'BackgroundDrawingController',
                        controllerAs: 'vm',
                        data: {
                            roles: ['user']
                        }
                    })
                    ;
                $urlRouterProvider.otherwise('/');

                $locationProvder.html5Mode(false);
            }
        }

    }
}