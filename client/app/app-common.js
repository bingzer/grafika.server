(function (angular, app){

    app.factory('appCommon', ['$log', '$q', '$interval', '$timeout', '$location', '$window', '$cookieStore', '$mdToast', '$mdDialog', 'appConfig', 
        function ($log, $q, $interval, $timeout, $location, $window, $cookieStore, $mdToast, $mdDialog, appConfig) {
            function getCurrentRoute() {
                if ($route.current && $route.current.regexp){
                    for (var i = 0; i < appConfig.routes.length; i++){
                        var route = appConfig.routes[i];
                        if ($route.current.originalPath === route.url || $route.current.redirectTo === route.url)
                            return route;
                    }   
                }
                return { url: '/' };
            }
            
            function alert(msg, title, okText){
                var alert = $mdDialog.alert()
                    .parent(angular.element(document.body))
                    .content(msg)
                    .ariaLabel('Dialog')
                    .ok(okText || 'Ok');
                if (title) alert.title(title);
                return $mdDialog.show(alert);
            }
            
            function confirm(msg, title, okText, cancelText){
                var confirm = $mdDialog.confirm()
                    .parent(angular.element(document.body))
                    .content(msg)
                    .ariaLabel('Dialog')
                    .ok(okText || 'Ok')
                    .cancel(cancelText || 'Cancel');
                if (title) confirm.title(title);
                return $mdDialog.show(confirm);
            }
            
            function refreshPage(){
                $location.path($location.path());
            }
            
            function toast(msg, position, delay){
                if (!position) position = 'bottom right';
                if (!delay) delay = 3000;
                $mdToast.show(
                    $mdToast.simple().content(msg)
                        .position(position)
                        .hideDelay(delay)
                    );
                $log.log(msg);
            }
            
            function navigateHome(){
                navigate('/');
            }
            
            function navigate(path){
                $location.path(path);
            }
            
            function randomUid() {
                return ("0000" + (Math.random()*Math.pow(36,4) << 0).toString(36)).slice(-4)
            }
            
            function formatErrorMessage(msg){
                if (!msg) return msg;
                if (msg.errorMessage && msg.errorMessage.length > 0) return msg.errorMessage;   
                if (msg.message && msg.message.length > 0) return msg.message;
                if (msg.data && msg.data.length > 0) return msg.data;
                return 'An error has occured';
            }
            
            function putStorageItem(key, value){
                return $q(function (resolve, reject){
                    if (!angular.isString(value))
                        value = JSON.stringify(value);
                    $window.sessionStorage.setItem(key, value);
                    return resolve(key);
                });
            }        
            function removeStorageItem(prefix){
                return $q(function (resolve, reject){
                    if (!prefix){
                        $window.sessionStorage.clear();
                        resolve();
                    }
                    else {
                        var i = $window.sessionStorage.length;
                        while (i--){
                            var key = $window.sessionStorage.key(i);
                            if (new RegExp(prefix).test(key))
                                $window.sessionStorage.removeItem(key);
                        }
                        resolve();
                    }
                });
            }
            function getStorageItem(key){
                return $q(function (resolve, reject){
                    var item = $window.sessionStorage.getItem(key);
                    if (!item) resolve(null);
                    else return resolve(JSON.parse(item));
                });
            }
            function hasStorageItem(key){
                return $window.sessionStorage.getItem(key) != null;
            }
            function showLoadingModal(){
                $('#progress-modal').css('visibility', 'visible');
                return $q.when(true);
            }
            function hideLoadingModal(){
                var deferred = $q.defer();
                $timeout(function (){
                    $('#progress-modal').css('visibility', 'hidden');
                    deferred.resolve();
                }, 1000);
                return deferred.promise;
            }
            function setLoadingModal(loading){
                if (loading) return showLoadingModal();
                else return hideLoadingModal();
            }
            function contentDialog(templateUrl){
                return $mdDialog.show({
                    templateUrl: templateUrl,
                    parent: angular.element(document.body),
                });
            }
            function getBaseUrl(){
                if ($location.host() !== 'localhost'){
                    return $location.protocol() + '://' + $location.host() + ($location.port() != 80 ? ':' + $location.port() : '') + '/';
                }
                return appConfig.defaultBaseUrl;
            }


            return {
                $log: $log,
                $q: $q,
                $interval: $interval,
                $timeout: $timeout,
                $location: $location,
                $window: $window,
                $cookieStore: $cookieStore,
                $mdToast: $mdToast,
                $mdDialog: $mdDialog,
                appConfig: appConfig,
                
                // convenient functions
                alert: alert,
                confirm: confirm,
                toast: toast,
                refreshPage: refreshPage,
                
                navigate: navigate,
                navigateHome: navigateHome,
                
                formatErrorMessage: formatErrorMessage,
                getCurrentRoute: getCurrentRoute,
                randomUid: randomUid,
                
                setLoadingModal: setLoadingModal,
                hideLoadingModal: hideLoadingModal,
                showLoadingModal: showLoadingModal,
                
                // session storage
                putStorageItem: putStorageItem,
                removeStorageItem: removeStorageItem,
                getStorageItem: getStorageItem,
                hasStorageItem: hasStorageItem,
                
                getBaseUrl: getBaseUrl,
            };

            

        }
    ]);


})(window.angular, window.angular.app);