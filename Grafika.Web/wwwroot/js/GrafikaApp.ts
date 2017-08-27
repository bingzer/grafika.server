
module GrafikaApp {
    //---------------------------------------------------------------------------------------------------------//
    //window.onerror = (msg, url, lineNo, columnNo, error) => GrafikaApp.toastError(msg || error);
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

    // ---------------- Toastr setup ----------- //
    toastr.options = {
        debug: false,
        positionClass: "toast-bottom-right",
    };

    // ---------------- Ajax setup ----------- //
    $.ajaxSetup({
        cache: false,
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
    });

    // ---------------- GrafikaApp.Configuration ----------- //

    export var Configuration: GrafikaApp.IGrafikaAppConfiguration;
    export var User: Grafika.IUser;
    export const StorageAnimationKey = "LocalAnimation";
    export const StorageFramesKey = "LocalFrames";
    export const StorageThumbnailKey = "LocalAnimationThumbnail";
    export const StorageResourcesKey = "LocalAnimationResources";

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

    export function navigateHome() {
        navigateTo('/');
    }

    export function isString(any: any): boolean {
        return typeof (any) === 'string';
    }

    export function isUndefined(any: any): boolean {
        return typeof (any) === 'undefined';
    }

    export function trimBoth(any: string, charlist: string = undefined): string {
        return GrafikaApp.trimEnd(GrafikaApp.trimStart(any, charlist), charlist);
    };

    export function trimStart(any: string, charlist: string = undefined): string {
        if (charlist === undefined)
            charlist = "\s";

        return any.replace(new RegExp("^[" + charlist + "]+"), "");
    };

    export function trimEnd(any: string, charlist: string = undefined): string {
        if (charlist === undefined)
            charlist = "\s";

        return any.replace(new RegExp("[" + charlist + "]+$"), "");
    };

    export function combineUrl(url: string, ...others: string[]): string {
        let combine = (url: string, other: string): string => {
            if (GrafikaApp.isUndefined(url)) url = "";
            if (GrafikaApp.isUndefined(other)) other = "";

            url = GrafikaApp.trimEnd(url, '/');
            other = GrafikaApp.trimStart(other, '/');

            return GrafikaApp.trimEnd(`${url}/${other}`, '/');
        }

        for (let i = 0; i < others.length; i++) {
            url = combine(url, others[i]);
        }

        return url;
    }

    export function toastError(message: any, title?: string, options?: ToastrOptions): JQuery {
        return toastr.error(formatError(message).message, title);
    }

    export function toast(message: string, title?: string, options?: ToastrOptions): JQuery {
        return toastr.success(message, title, options);
    }

    export function putStorageItem(key: string, value: any): JQueryPromise<string> {
        return GrafikaApp.defer<string>((defer) => {
            if (!GrafikaApp.isString(value)) {
                value = JSON.stringify(value);
            }

            sessionStorage.setItem(key, value);
            defer.resolve(key);
        }).promise();
    }

    export function removeStorageItem(prefix?: string): JQueryPromise<any> {
        return GrafikaApp.defer<any>((defer) => {
            if (!prefix) {
                sessionStorage.clear();
                defer.resolve();
            }
            else {
                let i = sessionStorage.length;
                while (i--) {
                    let key = sessionStorage.key(i);
                    if (new RegExp(prefix).test(key))
                        sessionStorage.removeItem(key);
                }
                defer.resolve();
            }
        }).promise();
    }

    export function getStorageItem<T>(key: string): JQueryPromise<T> {
        return GrafikaApp.defer<T>((defer) => {
            let item: any = sessionStorage.getItem(key);
            if (!item) defer.resolve(null);
            else {
                try {
                    item = JSON.parse(item);
                }
                catch (e) {
                    // do nothing
                }
                return defer.resolve(<T> item);
            }
        }).promise();
    }

    export function hasStorageItem(key: string): boolean {
        return sessionStorage.getItem(key) != null;
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

    export function defer<T>(action?: (deferred: JQueryDeferred<T>) => any): JQueryDeferred<T> {
        let defer: any = jQuery.Deferred<T>();
        defer.originalPromise = defer.promise;
        defer.promise = (target?: any) => {
            if (action)
                action(defer);
            return defer.originalPromise(target);
        };
        return defer;
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

    export function loadElements(root?: any) {
        if (root == null) root = $(document);
        let $root = $(root);

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

        GrafikaApp.Partials.loadElements($root);
        GrafikaApp.Dialog.loadElements($root);
    }

    export function sendAjax(elem: any, onResult?: IAjaxResultCallback): JQueryPromise<any> {
        if (jQuery.isPlainObject(elem)) {
            if (elem.data && !elem.rawData)
                elem.rawData = elem.data;
            elem.data = (name) => {
                if (name == 'data')
                    name = 'rawData';
                return elem[name];
            }
        }
        else
            elem = $(elem);

        if (!elem.data('url')) throw new Error('Expecting data-url');
        if (elem.data('loaded')) return jQuery.when();
        if (!onResult)
            onResult = (err: Error, result: any, elem: JQuery): JQueryPromise<any> => jQuery.when(result);

        let target = elem.data('target');
        let shouldAppend = elem.data('partial') === 'append';
        let shouldEvaluateData = GrafikaApp.isUndefined(elem.data('eval-data')) ? true : elem.data('eval-data');
        let callback = elem.data('callback');
        let errorCallback = elem.data('error');
        let timeout = elem.data('timeout');
        let opts: JQueryAjaxSettings = {
            url: elem.data('url'),
            method: elem.data('method') || 'get',
            data: elem.data('data'),
            contentType: elem.data('type') || elem.data('contentType') || elem.data('content-type') || 'application/json',
            processData: elem.data('process-data') || elem.data('processData'),
            beforeSend: elem.data('beforeSend'),
            headers: elem.data('headers')
        };

        let evaluateData = (data) => {
            if (!data) return data;

            let processDataPerMethod = (data) => {
                if (opts.method.toUpperCase() === 'POST' && !GrafikaApp.isString(data))
                    return JSON.stringify(data);
                return data;
            }

            try {
                let result = data;
                let fn = eval(data);
                if (typeof (fn) === 'function') {
                    result = fn();
                    return JSON.stringify(result);
                }
                return processDataPerMethod(data);
            }
            catch (e) {
                return processDataPerMethod(data);
            }
        };

        let invokeCallback = (res: any, xhrReq: JQueryXHR): JQueryPromise<any> => {
            if (callback) {
                let $result = res;
                let $xhr = xhrReq;
                if (typeof callback === 'function')
                    callback($result, $xhr);
                else eval(callback);
            }
            return jQuery.when(res);
        }

        let invokeErrorCallback = (err: Error, xhrReq: JQueryXHR): JQueryPromise<any> => {
            if (errorCallback) {
                let $err = err;
                let $xhr = xhrReq;
                if (typeof callback === 'function')
                    callback($err, $xhr);
                else eval(callback);
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

            if (shouldEvaluateData) {
                opts.data = evaluateData(opts.data);
            }
            return jQuery.ajax(opts).then(sucessCallback, failCallback)
        }

        if (timeout && timeout > 0) {
            let defer = GrafikaApp.defer();
            setTimeout(() => {
                doSend().then((res) => defer.resolve(res), (err) => defer.reject(err));
            }, timeout);
            return defer.promise();
        }
        else return doSend();
    }

    // ---------------- Interface ----------- //

    export interface IGrafikaAppConfiguration {

        debug: boolean,
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