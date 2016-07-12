(function (angular, app){
    /**
     * Main Controller
     */
    app.controller('MainController', function (appCommon, authService) {     
		var vm = this;

        vm.isAuthorized = authService.isAuthorized;
        vm.getUser = authService.getUser
        vm.confirmLogout = function(){
            appCommon.confirm('Are you sure you want to log out?')
                .then(appCommon.showLoadingModal)
                .then(authService.logout)
                .then(appCommon.hideLoadingModal)
                .then(function (){
                    appCommon.toast('Successfully logged out');
                });
        }

        var query = appCommon.$location.search();
        if (query && query.action){
            if ((query.action == 'verify' || query.action == 'reset-pwd') && query.hash && query.user){
                appCommon.$mdDialog.show({
                    controller: 'ResetController',
                    controllerAs: 'vm',
                    templateUrl: 'app/account/reset.html',
                    parent: angular.element(document.body),
                    locals: { hash: query.hash, email: query.user }
                }).then(appCommon.navigateHome);
                cleanUrlQueries();
            }
            else {
                appCommon.alert('Unknown action or link has expired');
                cleanUrlQueries();
            }
        }        
        
        function cleanUrlQueries(){
            Object.keys(appCommon.$location.search()).forEach(function (key){
               delete appCommon.$location.search()[key]; 
            });
        }
    });
})(window.angular, window.angular.app);