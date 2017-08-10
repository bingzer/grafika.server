module GrafikaApp {
    export module Drawing {
        export class AppCommon {
            public static $inject = [
                '$q',
                '$log',
                '$interval',
                '$timeout',
                '$location',
                '$window',
                '$cookies',
                '$mdToast',
                '$mdDialog',
                '$state',
                '$stateParams',
                '$mdPanel',
                '$mdMedia',
                '$mdSidenav',
                'appConfig'
            ];
            constructor(
                public $q: ng.IQService,
                public $log: ng.ILogService,
                public $interval: ng.IIntervalService,
                public $timeout: ng.ITimeoutService,
                public $location: ng.ILocationService,
                public $window: ng.IWindowService,
                public $cookies: ng.cookies.ICookiesService,
                public $mdToast: ng.material.IToastService,
                public $mdDialog: ng.material.IDialogService,
                public $state: ng.ui.IStateService,
                public $stateParams: ng.ui.IStateParamsService,
                public $mdPanel: ng.material.IPanelService,
                public $mdMedia: ng.material.IMedia,
                public $mdSidenav: ng.material.ISidenavService,
                public appConfig: IGrafikaAppConfiguration
            ) {
                // nothing
            }

            elem(selector: string): JQuery {
                return angular.element(selector);
            }
            alert(msg: string, title?: string, okText?: string): ng.IPromise<any> {
                let alert = this.$mdDialog.alert()
                    .parent(angular.element(document.body))
                    .htmlContent(msg)
                    .ariaLabel('Dialog')
                    .ok(okText || 'Ok');
                if (title) alert.title(title);
                return this.$mdDialog.show(alert);
            }
            confirm(msg: string, title?: string, okText?: string, cancelText?: string): ng.IPromise<any> {
                let confirm = this.$mdDialog.confirm()
                    .parent(angular.element(document.body))
                    .htmlContent(msg)
                    .ariaLabel('Dialog')
                    .ok(okText || 'Ok')
                    .cancel(cancelText || 'Cancel');
                if (title) confirm.title(title);
                return this.$mdDialog.show(confirm);
            }
            toastError(error: any, position?: string, delay?: number): ng.IPromise<any> {
                GrafikaApp.toastError(this.formatErrorMessage(error));
                return this.$q.when(true);
            };
            toast(msg: string, position?: string, delay?: number): ng.IPromise<any> {
                if (!position) position = 'top right';
                if (!delay) delay = 3000;
                this.$log.log(msg);

                GrafikaApp.toast(msg);
                return this.$q.when(true);
            }
            showModalDialog(templateUrl: string, controller?: string | any, event?: MouseEvent, locals?: { [index: string]: any }, controllerAs?: string): ng.IPromise<any> {
                return this.showDialog(templateUrl, controller, event, locals, controllerAs, true);
            }
            showDialog(templateUrl: string, controller?: string | any, event?: MouseEvent, locals?: { [index: string]: any }, controllerAs?: string, modal?: boolean): ng.IPromise<any> {
                if (!controllerAs)
                    controllerAs = 'vm';
                if (!modal) modal = false;
                let useFullScreen = (this.$mdMedia('sm') || this.$mdMedia('xs'));
                return this.$mdDialog.show({
                    fullscreen: useFullScreen,
                    controller: controller,
                    controllerAs: controllerAs,
                    parent: angular.element(document.body),
                    templateUrl: templateUrl,
                    clickOutsideToClose: !modal,
                    targetEvent: event,
                    locals: locals,
                    multiple: true
                });
            }
            refreshPage() {
                return this.$location.path(this.$location.path());
            }
            navigateHome() {
                return this.navigate('/animations');
            }
            navigate(path: string) {
                return this.$location.url(path);
            }
            randomUid(): string {
                return ("0000" + (Math.random() * Math.pow(36, 4) << 0).toString(36)).slice(-4)
            }
            cleanUrlQueries() {
                let keys = this.$location.search();
                let loc = this.$location;
                Object.keys(keys).forEach((key) => {
                    loc.search(key, null);
                });

                this.$location.hash(null);
            }

            formatErrorMessage(msg: any): string {
                if (!msg) msg = 'An error has occurred';
                if (msg.errorMessage && msg.errorMessage.length > 0) return msg.errorMessage;
                if (msg.message && msg.message.length > 0) return msg.message;
                if (msg.data && msg.data.length > 0) return msg.data;
                if (msg.statusText) return msg.statusText;
                if (msg.config && msg.headers) msg = 'An HTTP error has occurred';
                return msg;
            }

            putStorageItem(key: string, value: any): ng.IPromise<string> {
                return this.$q((resolve, reject) => {
                    if (!angular.isString(value))
                        value = JSON.stringify(value);
                    this.$window.sessionStorage.setItem(key, value);
                    return resolve(key);
                });
            }
            removeStorageItem(prefix?: string): ng.IPromise<any> {
                return this.$q((resolve, reject) => {
                    if (!prefix) {
                        this.$window.sessionStorage.clear();
                        resolve();
                    }
                    else {
                        let i = this.$window.sessionStorage.length;
                        while (i--) {
                            let key = this.$window.sessionStorage.key(i);
                            if (new RegExp(prefix).test(key))
                                this.$window.sessionStorage.removeItem(key);
                        }
                        resolve();
                    }
                });
            };
            getStorageItem(key: string): ng.IPromise<any> {
                return this.$q((resolve, reject) => {
                    let item = this.$window.sessionStorage.getItem(key);
                    if (!item) resolve(null);
                    else return resolve(JSON.parse(item));
                });
            };
            hasStorageItem(key: string): boolean {
                return this.$window.sessionStorage.getItem(key) != null;
            }
            showLoadingModal(): ng.IPromise<any> {
                angular.element('#progress-modal').css('visibility', 'visible');
                return this.$q.when(true);
            }
            hideLoadingModal(): ng.IPromise<any> {
                let deferred = this.$q.defer();
                this.$timeout(() => {
                    angular.element('#progress-modal').css('visibility', 'hidden');
                    deferred.resolve();
                }, 500);
                return deferred.promise;
            }
            setLoadingModal(loading: boolean): ng.IPromise<any> {
                if (loading) return this.showLoadingModal();
                else return this.hideLoadingModal();
            }
            contentDialog(templateUrl: string) {
                return this.$mdDialog.show({
                    templateUrl: templateUrl,
                    parent: angular.element(document.body),
                });
            }
            getBaseUrl() {
                return this.$location.protocol() + '://' + this.$location.host() + (this.$location.port() != 80 ? ':' + this.$location.port() : '') + '/';
            }
        }
    }
}