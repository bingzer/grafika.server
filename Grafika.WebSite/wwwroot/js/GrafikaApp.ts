
module GrafikaApp {
    export var Configuration: GrafikaApp.IGrafikaAppConfiguration;

    export function getQueryString(name: string, url: string = null): string {
        if (!url) url = window.location.href;
        name = name.replace(/[\[\]]/g, "\\$&");
        var regex = new RegExp("[?&]" + name + "(=([^&#]*)|&|#|$)"),
            results = regex.exec(url);
        if (!results) return null;
        if (!results[2]) return '';
        return decodeURIComponent(results[2].replace(/\+/g, " "));
    }

    export function loadElements() {
        let queryAction = GrafikaApp.getQueryString("action");
        switch (queryAction) {
            case "authenticate":
                var token = GrafikaApp.getQueryString("token");
                GrafikaApp.Configuration.setAuthenticationToken(token);
                window.location.search = '';
                break;
            case "deauthenticate":
                GrafikaApp.Configuration.setAuthenticationToken(token);
                window.location.search = '';
                break;
        }
    }

    // Highlight the top nav as scrolling occurs
    $('body').scrollspy({
        target: '.navbar-fixed-top',
        offset: 51
    });

    // Closes the Responsive Menu on Menu Item Click
    $('.navbar-collapse ul li a').click(() => {
        $('.navbar-toggle:visible').click();
    });

    // Offset for Main Navigation
    $('#mainNav').affix({
        offset: {
            top: 100 
        }
    })

    // Initialize and Configure Scroll Reveal Animation
    let sr = ScrollReveal();
    sr.reveal('.sr-icons', {
        duration: 600,
        scale: 0.3,
        distance: '0px'
    }, 200);
    sr.reveal('.sr-button', {
        duration: 1000,
        delay: 200
    });
    sr.reveal('.sr-contact', {
        duration: 600,
        scale: 0.3,
        distance: '0px'
    }, 300);
    window['sr'] = sr;

    // ---------------- Ajax setup ----------- //
    $.ajaxSetup({
        beforeSend: function (xhr) {
            let token = GrafikaApp.Configuration.getAuthenticationToken();
            if (token) {
                xhr.setRequestHeader('Authorization', `Bearer ${token}`);
            }
        }
    });

    export function sendAjax(elem: any, onResult?: IAjaxResultCallback): JQueryPromise<any> {
        elem = $(elem);
        if (!elem.data('url')) throw new Error('Expecting data-url');
        if (elem.data('loaded')) return jQuery.when();
        if (!onResult)
            onResult = (err: Error, result: any, elem: JQuery): JQueryPromise<any> => jQuery.when(result);

        let target = elem.data('target');
        let shouldAppend = elem.data('partial') === 'append';
        let callback = elem.data('callback');
        let errorCallback = elem.data('error');
        let timeout = elem.data('timeout');
        let opts = {
            url: elem.data('url'),
            method: elem.data('method'),
            data: elem.data('data'),
            contentType: elem.data('type')
        };

        let invokeCallback = (res: any, xhrReq: JQueryXHR): JQueryPromise<any> => {
            if (callback) {
                let $res = res;
                let $xhr = xhrReq;
                eval(callback);
            }
            return jQuery.when(res);
        }

        let invokeErrorCallback = (err: Error, xhrReq: JQueryXHR): JQueryPromise<any> => {
            if (errorCallback) {
                let $err = err;
                let $xhr = xhrReq;
                eval(errorCallback);
            }
            return jQuery.when(err);
        }

        let doSend = (): JQueryPromise<any> => {
            let sucessCallback = (data: any, textStatus: string, xhr: JQueryXHR) => {
                return onResult(undefined, data, elem).then(() => invokeCallback(data, xhr));
            }
            let failCallback = (xhr: JQueryXHR, textStatus: string, errorThrown: any) => {
                let err = new Error(errorThrown);
                return onResult(err, undefined, elem).then(() => invokeErrorCallback(err, xhr));
            }

            return jQuery.ajax(opts).then(sucessCallback, failCallback)
        }

        if (timeout && timeout > 0) {
            var deferred = jQuery.Deferred<any>();
            setTimeout(() => {
                doSend().then((res, text, xhrReq) => deferred.resolve(res))
                    .fail((err) => deferred.reject(err));
            }, timeout);
            return deferred.promise();
        }
        else return doSend();
    }

    // ---------------- document ready ----------- //
    $(document).ready(() => {
        GrafikaApp.loadElements();
        GrafikaApp.Partials.loadElements();
        GrafikaApp.Dialog.loadElements();
    });

    // ---------------- GrafikaApp.Configuration ----------- //

    GrafikaApp.Configuration.getAuthenticationToken = function () {
        return window.localStorage.getItem('token');
    }
    GrafikaApp.Configuration.setAuthenticationToken = function (token: string) {
        window.localStorage.setItem('token', token);
    }

    // ---------------- Interface ----------- //

    export interface IGrafikaAppConfiguration {
        baseApiUrl?: string;
        shouldInflateFrame?: boolean;

        getAuthenticationToken(): string;
        setAuthenticationToken(token: string): void;
    }

    export interface IAjaxResultCallback {
        (err: Error, result: any, elem: JQuery): JQueryPromise<any>;
    }
}