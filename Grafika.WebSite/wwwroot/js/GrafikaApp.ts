
module GrafikaApp {
    //---------------------------------------------------------------------------------------------------------//
    window.onerror = (msg, url, lineNo, columnNo, error) => GrafikaApp.toastError(msg || error);
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

    // ---------------- Toastr setup ----------- //
    toastr.options = {
        debug: false,
        positionClass: "toast-bottom-right",
    };

    // ---------------- Ajax setup ----------- //
    $.ajaxSetup({
        error: (error) => GrafikaApp.toastError(error),
        beforeSend: (xhr) => {
            let token = GrafikaApp.Configuration.getAuthenticationToken();
            if (token) {
                xhr.setRequestHeader('Authorization', `Bearer ${token}`);
            }
        }
    });

    // ---------------- document ready ----------- //
    $(document).ready(() => {
        GrafikaApp.loadElements();
        GrafikaApp.Partials.loadElements();
        GrafikaApp.Dialog.loadElements();
    });

    // ---------------- GrafikaApp.Configuration ----------- //

    export var Configuration: GrafikaApp.IGrafikaAppConfiguration;

    GrafikaApp.Configuration.getAuthenticationToken = function () {
        return window.localStorage.getItem('token');
    }
    GrafikaApp.Configuration.setAuthenticationToken = function (token: string) {
        window.localStorage.setItem('token', token);
    }

    //---------------------------------------------------------------------------------------------------------//

    export function formatError(error: Error | any): IError {
        let objError = { message: '', detail: '' };
        if (error.message)
            objError = error;
        else if (error.responseJSON && error.responseJSON.message)
            objError = error.responseJSON;
        else if (error.status && error.statusText)
            objError.message = (error as JQueryXHR).statusText;

        // last check
        if (!objError.message)
            objError.message = 'Unexpected error occured';

        return objError;
    }

    export function clearQueryString() {
        window.location.search = '';
    }

    export function refreshPage() {
        window.location.reload();
    }

    export function navigateTo(url) {
        window.location.href = url;
    }

    export function toastError(message: any, title?: string): JQuery {
        return toastr.error(formatError(message).message, title);
    }

    export function toast(message: string, title?: string): JQuery {
        return toastr.success(message, title);
    }

    export function getQueryString(name: string, url: string = null): string {
        if (!url) url = window.location.href;
        name = name.replace(/[\[\]]/ig, "\\$&");
        var regex = new RegExp("[?&]" + name + "(=([^&#]*)|&|#|$)", "i"),
            results = regex.exec(url);
        if (!results) return null;
        if (!results[2]) return '';
        return decodeURIComponent(results[2].replace(/\+/ig, " "));
    }

    export function generateSlug(name: string, maxLength: number = 45): string {
        let str = name.replace(/^\s+|\s+$/g, ''); // trim
        str = str.toLowerCase();

        // remove accents, swap ñ for n, etc
        let from = "ãàáäâẽèéëêìíïîõòóöôùúüûñç·/_,:;";
        let to = "aaaaaeeeeeiiiiooooouuuunc------";
        for (let i = 0, l = from.length; i < l; i++) {
            str = str.replace(new RegExp(from.charAt(i), 'g'), to.charAt(i));
        }

        str = str.replace(/[^a-z0-9 -]/g, '') // remove invalid chars
            .replace(/\s+/g, '-') // collapse whitespace and replace by -
            .replace(/-+/g, '-'); // collapse dashes

        return str.substring(0, 45);
    }

    export function loadElements() {
        let queryAction = GrafikaApp.getQueryString("action");
        switch (queryAction) {
            case "authenticate":
                var token = GrafikaApp.getQueryString("token");
                GrafikaApp.Configuration.setAuthenticationToken(token);
                clearQueryString();
                break;
            case "deauthenticate":
                GrafikaApp.Configuration.setAuthenticationToken(token);
                clearQueryString();
                break;
        }
    }

    export function sendAjax(elem: any, onResult?: IAjaxResultCallback): JQueryPromise<any> {
        if (jQuery.isPlainObject(elem))
            elem.data = (name) => elem[name];
        else
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
        let opts: JQueryAjaxSettings = {
            url: elem.data('url'),
            method: elem.data('method'),
            data: elem.data('data'),
            contentType: elem.data('type'),
            processData: elem.data('process-data')
        };

        let evaluateData = (data) => {
            if (!data) return data;
            try {
                let result = data;
                let fn = eval(data);
                if (typeof (fn) === 'function') {
                    result = fn();
                    result = JSON.stringify(result);
                }
                return result;
            }
            catch (e) {
                return data;
            }
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

            opts.data = evaluateData(opts.data);
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

    export interface IError {
        message: string
    }
}