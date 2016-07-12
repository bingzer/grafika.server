(function (angular, app){
	app.controller('RegisterController', function ($mdDialog, appCommon, authService){
		var vm = this;
        vm.message = 'After signing up, you will receive email to activate your account.';
        vm.register = function(){
            vm.message = 'Sending verification email...';
            vm.busy = true;
            authService.register({ name: vm.name, email: vm.email, password: 'fake-password'})
                .then(function (res){
                    if (res.status == 200) vm.message = "Email has been sent";
                    else vm.handleError(res);
                    vm.busy = false;
                    vm.done = true;
                })
                .catch(vm.handleError);
        };
        vm.close = function(){
            appCommon.$mdDialog.cancel();
        }
        vm.handleError = function (err){
            vm.message = appCommon.formatErrorMessage(err);
            vm.busy = false;
        }
        vm.close = function(){
            $mdDialog.cancel();
        }
	});
})(window.angular, window.angular.app);