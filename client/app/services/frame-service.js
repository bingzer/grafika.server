(function (angular) {
    var app = angular.module('app');

	app.factory('frameService', ['appCommon', 'authService', 'apiService', function (appCommon, authService, apiService) {
		function get(anim) {
			return apiService.get('animations/' + anim._id + '/frames');
		}
		function update(anim, data) {
			return apiService.post('animations/' + anim._id + '/frames', data);
		}

		return {
			get: get,
            update: update
		};
		
	}]);
})(window.angular);