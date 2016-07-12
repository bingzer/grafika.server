(function (angular, app){
	app.controller('AnimationCreateController', function($mdDialog, $state, animationService, frameService) {
        var vm = this;
        vm.isPublic = false;

        vm.cancel = function(){
            $mdDialog.cancel();
        }

        vm.create = function(){
            animationService.create({name: vm.name, width: 800, height: 400, isPublic: vm.isPublic}).then(function (res){
                var anim = res.data;
                $state.go('editor', { _id: anim._id });
                vm.cancel();
            })
        }
	});
})(window.angular, window.angular.app);