(function($) {
    "use strict"; // Start of use strict

    // jQuery for page scrolling feature - requires jQuery Easing plugin
    $(document).on('click', 'a.page-scroll', function(event) {
        var $anchor = $(this);
        $('html, body').stop().animate({
            scrollTop: ($($anchor.attr('href')).offset().top - 50)
        }, 1250, 'easeInOutExpo');
        event.preventDefault();
    });

    // Highlight the top nav as scrolling occurs
    $('body').scrollspy({
        target: '.navbar-fixed-top',
        offset: 51
    });

    // Closes the Responsive Menu on Menu Item Click
    $('.navbar-collapse ul li a').click(function() {
        $('.navbar-toggle:visible').click();
    });

    // Offset for Main Navigation
    $('#mainNav').affix({
        offset: {
            top: 100
        }
    })

    // Initialize and Configure Scroll Reveal Animation
    window.sr = ScrollReveal();
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

    // Initialize and Configure Magnific Popup Lightbox Plugin
    $('.popup-gallery').magnificPopup({
        delegate: 'a',
        type: 'image',
        tLoading: 'Loading image #%curr%...',
        mainClass: 'mfp-img-mobile',
        gallery: {
            enabled: true,
            navigateByImgClick: true,
            preload: [0, 1] // Will preload 0 - before current, and 1 after the current image
        },
        image: { 
            tError: '<a href="%url%">The image #%curr%</a> could not be loaded.'
        }
    });

    $(document).ready(function () {
        loadElements();
    });

})(jQuery); // End of use strict

function loadElements() {
    $('[data-partial=auto], [data-partial=tab].active').each(function (i, elem) {
        renderPartial(elem);
    });
    $('[data-partial=tab]').each(function (i, elem) {
        elem = $(elem);
        $('a[href="#' + elem.attr('id') + '"]').on('shown.bs.tab', function (e) {
            renderPartial(elem).then(function () {
                elem.data('loaded', true);
            });
        });
    })
}

function renderPartial(elem) {
    elem = $(elem);
    if (!elem.data('url')) throw new Error('Expecting data-url');
    if (elem.data('loaded')) return jQuery.when();

    var target = elem.data('target');
    var opts = {  
        url: elem.data('url'),
        method: elem.data('method'),
        data: elem.data('data'),
    };

    function doSend() {
        return jQuery.ajax(opts).done(function (res) {
            if (target) target.html(res);
            else elem.html(res);
            return jQuery.when(res);
        });
    }

    return doSend();
}
