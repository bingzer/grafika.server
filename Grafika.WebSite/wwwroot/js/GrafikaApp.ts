
module GrafikaApp {
    export var Configuration: GrafikaApp.IGrafikaAppConfig;

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

    // ---------------- document ready ----------- //
    $(document).ready(() => {
        GrafikaApp.Partials.loadElements();
    });



    export interface IGrafikaAppConfig {
        baseApiUrl: string;
        shouldInflateFrame: boolean;
    }
}