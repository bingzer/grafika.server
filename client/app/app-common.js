var GrafikaApp;
(function (GrafikaApp) {
    'use-strict';
    var AppCommon = (function () {
        function AppCommon($q, $log, $interval, $timeout, $location, $window, $cookieStore, $mdToast, $mdDialog, appConfig) {
            this.$q = $q;
            this.$log = $log;
            this.$interval = $interval;
            this.$timeout = $timeout;
            this.$location = $location;
            this.$window = $window;
            this.$cookieStore = $cookieStore;
            this.$mdToast = $mdToast;
            this.$mdDialog = $mdDialog;
            this.appConfig = appConfig;
        }
        AppCommon.prototype.alert = function (msg, title, okText) {
            var alert = this.$mdDialog.alert()
                .parent(angular.element(document.body))
                .htmlContent(msg)
                .ariaLabel('Dialog')
                .ok(okText || 'Ok');
            if (title)
                alert.title(title);
            return this.$mdDialog.show(alert);
        };
        AppCommon.prototype.confirm = function (msg, title, okText, cancelText) {
            var confirm = this.$mdDialog.confirm()
                .parent(angular.element(document.body))
                .htmlContent(msg)
                .ariaLabel('Dialog')
                .ok(okText || 'Ok')
                .cancel(cancelText || 'Cancel');
            if (title)
                confirm.title(title);
            return this.$mdDialog.show(confirm);
        };
        AppCommon.prototype.toast = function (msg, position, delay) {
            if (!position)
                position = 'bottom right';
            if (!delay)
                delay = 3000;
            this.$log.log(msg);
            return this.$mdToast.show(this.$mdToast.simple().textContent(msg)
                .position(position)
                .hideDelay(delay));
        };
        ;
        AppCommon.prototype.refreshPage = function () {
            this.$location.path(this.$location.path());
        };
        AppCommon.prototype.navigateHome = function () {
            this.navigate('/');
        };
        AppCommon.prototype.navigate = function (path) {
            this.$location.path(path);
        };
        AppCommon.prototype.randomUid = function () {
            return ("0000" + (Math.random() * Math.pow(36, 4) << 0).toString(36)).slice(-4);
        };
        AppCommon.prototype.formatErrorMessage = function (msg) {
            if (!msg)
                return msg;
            if (msg.errorMessage && msg.errorMessage.length > 0)
                return msg.errorMessage;
            if (msg.message && msg.message.length > 0)
                return msg.message;
            if (msg.data && msg.data.length > 0)
                return msg.data;
            return 'An error has occured';
        };
        ;
        AppCommon.prototype.putStorageItem = function (key, value) {
            return this.$q(function (resolve, reject) {
                if (!angular.isString(value))
                    value = JSON.stringify(value);
                this.$window.sessionStorage.setItem(key, value);
                return resolve(key);
            });
        };
        AppCommon.prototype.removeStorageItem = function (prefix) {
            return this.$q(function (resolve, reject) {
                if (!prefix) {
                    this.$window.sessionStorage.clear();
                    resolve();
                }
                else {
                    var i = this.$window.sessionStorage.length;
                    while (i--) {
                        var key = this.$window.sessionStorage.key(i);
                        if (new RegExp(prefix).test(key))
                            this.$window.sessionStorage.removeItem(key);
                    }
                    resolve();
                }
            });
        };
        ;
        AppCommon.prototype.getStorageItem = function (key) {
            return this.$q(function (resolve, reject) {
                var item = this.$window.sessionStorage.getItem(key);
                if (!item)
                    resolve(null);
                else
                    return resolve(JSON.parse(item));
            });
        };
        ;
        AppCommon.prototype.hasStorageItem = function (key) {
            return this.$window.sessionStorage.getItem(key) != null;
        };
        AppCommon.prototype.showLoadingModal = function () {
            angular.element('#progress-modal').css('visibility', 'visible');
            return this.$q.when(true);
        };
        AppCommon.prototype.hideLoadingModal = function () {
            var deferred = this.$q.defer();
            this.$timeout(function () {
                angular.element('#progress-modal').css('visibility', 'hidden');
                deferred.resolve();
            }, 1000);
            return deferred.promise;
        };
        AppCommon.prototype.setLoadingModal = function (loading) {
            if (loading)
                return this.showLoadingModal();
            else
                return this.hideLoadingModal();
        };
        AppCommon.prototype.contentDialog = function (templateUrl) {
            return this.$mdDialog.show({
                templateUrl: templateUrl,
                parent: angular.element(document.body),
            });
        };
        AppCommon.prototype.getBaseUrl = function () {
            if (this.$location.host() !== 'localhost') {
                return this.$location.protocol() + '://' + this.$location.host() + (this.$location.port() != 80 ? ':' + this.$location.port() : '') + '/';
            }
            return this.appConfig.defaultBaseUrl;
        };
        AppCommon.$inject = [
            '$q',
            '$log',
            '$interval',
            '$timeout',
            '$location',
            '$window',
            '$cookieStore',
            '$mdToast',
            '$mdDialog',
            'appConfig'
        ];
        return AppCommon;
    }());
    GrafikaApp.AppCommon = AppCommon;
})(GrafikaApp || (GrafikaApp = {}));
//# sourceMappingURL=app-common.js.map