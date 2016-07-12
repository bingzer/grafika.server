(function (angular, app){
	app.controller('AnimationListController', function($rootScope, animationService) {
		var vm = this;
        vm.animations = [];

        vm.list = function(){
            animationService.list().then(function (res){
                vm.animations = res.data;
            });
        }

        vm.list();
	});
})(window.angular, window.angular.app);