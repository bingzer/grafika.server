(function (angular, app){
	app.controller('ResetController', function ($mdDialog, appCommon, authService, hash, email){
		var vm = this;
		vm.user = { hash : hash, email : email };
		vm.requireCurrentPassword = false;
        vm.title = 'Set password'
        vm.subtitle = 'Hi ' + vm.user.email + ', please set your password';
		vm.closable = false;
		vm.changePassword = function(){
			if (vm.newPassword != vm.confirmPassword)
				vm.message = "Please re-confirm your password";
            else {
                vm.busy = true;
                vm.user.password = vm.newPassword;
                return authService.register(vm.user)
                        .then(function(){
                            appCommon.$mdDialog.hide();
                            appCommon.toast('Password is sucessfully set, please re-login');
                        })
                        .catch(vm.handleError);
            }
		}
		vm.close = function(){
			appCommon.$mdDialog.cancel(); 
		}
        vm.handleError = function (err){
            vm.user = {};
            vm.message = appCommon.formatErrorMessage(err);
            vm.busy = false;
            vm.done = true;
        }
	});
})(window.angular, window.angular.app);