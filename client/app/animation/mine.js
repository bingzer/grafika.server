(function (angular, app){
	app.controller('MyAnimationsController', function($rootScope, $mdDialog, animationService, authService) {
		var vm = this;
        vm.animations = [];

        vm.list = function(){
            var paging = animationService.createPaging();
            paging.userId = authService.getUser()._id;
            animationService.list(paging).then(function (res){
                vm.animations = res.data;
            });
        }
		
		vm.create = function(ev){
    		var useFullScreen = false;//($mdMedia('sm') || $mdMedia('xs'));
			$mdDialog.show({
				controller: 'AnimationCreateController as vm',
				templateUrl: '/app/animation/create.html',
				parent: window.angular.element(document.body),
				targetEvent: ev,
				clickOutsideToClose:true,
				fullscreen: useFullScreen
			})
			.then(function(answer) {
					//$scope.status = 'You said the information was "' + answer + '".';
				}, function() {
					//$scope.status = 'You cancelled the dialog.';
			});
		} 

        vm.list();
	});
})(window.angular, window.angular.app);