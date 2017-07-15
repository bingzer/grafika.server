var GrafikaApp;
(function (GrafikaApp) {
    // Highlight the top nav as scrolling occurs
    $('body').scrollspy({
        target: '.navbar-fixed-top',
        offset: 51
    });
    // Closes the Responsive Menu on Menu Item Click
    $('.navbar-collapse ul li a').click(function () {
        $('.navbar-toggle:visible').click();
    });
    // Offset for Main Navigation
    $('#mainNav').affix({
        offset: {
            top: 100
        }
    });
    // Initialize and Configure Scroll Reveal Animation
    var sr = ScrollReveal();
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
    $(document).ready(function () {
        GrafikaApp.Partials.loadElements();
    });
})(GrafikaApp || (GrafikaApp = {}));
//# sourceMappingURL=C:/Users/ricky/GrafikaProject/grafika.server/Grafika.WebSite/Tempaltes/GrafikaApp/output/GrafikaApp.js.map