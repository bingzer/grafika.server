module grafikaApp {
    'use-strict';

    export class AppCommon {
        public static $inject = [
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
        ]

        constructor(
            public $q: ng.IQService,
            public $log: ng.ILogService,
            public $interval: ng.IIntervalService,
            public $timeout: ng.ITimeoutService,
            public $location: ng.ILocationService,
            public $window: ng.IWindowService,
            public $cookieStore: ng.cookies.ICookiesService,
            public $mdToast: ng.material.IToastService,
            public $mdDialog: ng.material.IDialogService,
            public appConfig: AppConfig
        )
        {
            // nothing
        }
        
        alert(msg: string, title?: string, okText?: string) : ng.IPromise<any> {
            var alert = this.$mdDialog.alert()
                .parent(angular.element(document.body))
                .htmlContent(msg)
                .ariaLabel('Dialog')
                .ok(okText || 'Ok');
            if (title) alert.title(title);
            return this.$mdDialog.show(alert);
        }    
        confirm(msg: string, title?: string, okText?: string, cancelText?: string): ng.IPromise<any>{
            var confirm = this.$mdDialog.confirm()
                .parent(angular.element(document.body))
                .htmlContent(msg)
                .ariaLabel('Dialog')
                .ok(okText || 'Ok')
                .cancel(cancelText || 'Cancel');
            if (title) confirm.title(title);
            return this.$mdDialog.show(confirm);
        }
        toast(msg: string, position?: string, delay?: number): ng.IPromise<any>{
            if (!position) position = 'bottom right';
            if (!delay) delay = 3000;
            this.$log.log(msg);

            return this.$mdToast.show(
                this.$mdToast.simple().textContent(msg)
                    .position(position)
                    .hideDelay(delay)
            );
        };
        
        refreshPage(){
            this.$location.path(this.$location.path());
        }
        navigateHome(){
            this.navigate('/');
        }
        navigate(path: string) {
            this.$location.path(path);
        }
        randomUid(): string {
            return ("0000" + (Math.random()*Math.pow(36,4) << 0).toString(36)).slice(-4)
        }

        formatErrorMessage(msg: any): string{
            if (!msg) return msg;
            if (msg.errorMessage && msg.errorMessage.length > 0) return msg.errorMessage;   
            if (msg.message && msg.message.length > 0) return msg.message;
            if (msg.data && msg.data.length > 0) return msg.data;
            return 'An error has occured';
        };
        putStorageItem(key: string, value: any): ng.IPromise<string>{
            return this.$q(function (resolve, reject){
                if (!angular.isString(value))
                    value = JSON.stringify(value);
                this.$window.sessionStorage.setItem(key, value);
                return resolve(key);
            });
        }
        removeStorageItem(prefix?: string): ng.IPromise<any>{
            return this.$q(function (resolve, reject){
                if (!prefix){
                    this.$window.sessionStorage.clear();
                    resolve();
                }
                else {
                    var i = this.$window.sessionStorage.length;
                    while (i--){
                        var key = this.$window.sessionStorage.key(i);
                        if (new RegExp(prefix).test(key))
                            this.$window.sessionStorage.removeItem(key);
                    }
                    resolve();
                }
            });
        };
        getStorageItem(key: string): ng.IPromise<any>{
            return this.$q(function (resolve, reject){
                var item = this.$window.sessionStorage.getItem(key);
                if (!item) resolve(null);
                else return resolve(JSON.parse(item));
            });
        };
        hasStorageItem(key: string): boolean{
            return this.$window.sessionStorage.getItem(key) != null;
        }
        showLoadingModal(): ng.IPromise<any>{
            angular.element('#progress-modal').css('visibility', 'visible');
            return this.$q.when(true);
        }
        hideLoadingModal(): ng.IPromise<any>{
            var deferred = this.$q.defer();
            this.$timeout(function (){
                angular.element('#progress-modal').css('visibility', 'hidden');
                deferred.resolve();
            }, 1000);
            return deferred.promise;
        }
        setLoadingModal(loading: boolean): ng.IPromise<any>{
            if (loading) return this.showLoadingModal();
            else return this.hideLoadingModal();
        }
        contentDialog(templateUrl: string){
            return this.$mdDialog.show({
                templateUrl: templateUrl,
                parent: angular.element(document.body),
            });
        }
        getBaseUrl(){
            if (this.$location.host() !== 'localhost'){
                return this.$location.protocol() + '://' + this.$location.host() + (this.$location.port() != 80 ? ':' + this.$location.port() : '') + '/';
            }
            return this.appConfig.defaultBaseUrl;
        }
    }

   
}