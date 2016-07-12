(function (angular, app){
	app.controller('LoginController', function ($mdDialog, appCommon, authService){
        var vm = this;

        vm.register = function (){
            appCommon.$mdDialog.show({
                controller: 'RegisterController',
                controllerAs: 'vm',
                templateUrl: 'app/account/register.html'
            });
        }        
        vm.login = function(provider){
            var loginProvider = provider;
            appCommon.showLoadingModal().then(function (){
                    return authService.login({ username: vm.username, password: vm.password }, provider);
                })
                .then(function (res){
                    if (!loginProvider) appCommon.navigateHome();
                    else appCommon.toast('Connecting to ' + loginProvider);
                })
                .then(appCommon.hideLoadingModal)
                .catch(vm.reset)
                .finally(function (){ vm.username = ''; vm.password = ''; })
        };

        function reset() {
            vm.isRegistering = false;
            vm.emamil = '';
            vm.password = '';
            vm.passwordConfirm = '';
        }

        reset();
	});
})(window.angular, window.angular.app);