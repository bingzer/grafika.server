
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

    // ---------------- document ready ----------- //
    $(document).ready(() => {
        GrafikaApp.loadElements();
        GrafikaApp.Partials.loadElements();
        GrafikaApp.Dialog.loadElements();
    });

    // ---------------- Interface ----------- //

    GrafikaApp.Configuration.getAuthenticationToken = function () {
        return window.localStorage.getItem('token');
    }
    GrafikaApp.Configuration.setAuthenticationToken = function (token: string) {
        window.localStorage.setItem('token', token);
    }

    export interface IGrafikaAppConfiguration {
        baseApiUrl?: string;
        shouldInflateFrame?: boolean;

        getAuthenticationToken(): string;
        setAuthenticationToken(token: string): void;
    }
}