(function (angular, $) { 'use strict';
    var app = angular.module('app');
    app.controller('ContentController', ['appCommon', 'apiService', function (appCommon, apiService) {
		var vm = this;
        vm.page = getUxPage();
        appCommon.uxService.setPage(vm.page);
        
        // -- feedbacks
        vm.feedbackCategories = ['Just saying Hi!', 'Bug', 'Features', 'Other'];
        vm.feedback = {};
        vm.sendFeedback = function(){
            apiService.post('content/feedback', vm.feedback).then(function (res){
                appCommon.toast('Feedback is submitted!');
            }).finally(function(){
                vm.feedback = {};
            });
        };
        
		function getUxPage() {
			return {
				onClose: appCommon.navigateHome,
				links: [
					{ title: 'About', click: function(){ appCommon.navigate('/about') }, selected: vm.section === 'about' },
					{ title: 'Credits', click: function(){ appCommon.navigate('/about/credits') }, selected: vm.section === 'credits' },
					{ title: 'Feedback', click: function(){ appCommon.navigate('/about/feedback') }, selected: vm.section === 'feedback' },
					{ title: 'Browsers', click: function(){ appCommon.navigate('/about/browsers') }, selected: vm.section === 'browsers' }
				]
			};
		}
	}]);
})(window.angular, window.jQuery);