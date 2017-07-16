module GrafikaApp {

    export class Home {
        public animPlayer: GrafikaApp.Player;

        public loadRandomAnimation(): Q.IPromise<any> {
            if (!this.animPlayer)
                this.animPlayer = new GrafikaApp.Player('#header-canvas');
            var element = jQuery('#animation-author');
            if (element.text().trim().length > 0) element.fadeOut();

            return jQuery.ajax({ url: `${GrafikaApp.Configuration.baseApiUrl}/animations?isRandom=true&isPublic=true`, cache: false }).done((res) => {
                var animation = res[0] as Grafika.IAnimation;
                element.html(`<a href="/animations/${animation._id}" title="View this animation">${animation.name} by ${animation.author}</a>`).fadeIn();
                return this.animPlayer.loadAnimation(animation._id).then(() => {
                    return this.animPlayer.play();
                });
            });
        }
    }

    // jQuery for page scrolling feature - requires jQuery Easing plugin
    $(document).on('click', 'a.page-scroll', function (event) {
        let $anchor = $(this);
        $('html, body').stop().animate({
            scrollTop: ($($anchor.attr('href')).offset().top - 50)
        }, 1250, 'easeInOutExpo');
        event.preventDefault();
    });

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

    $(document).ready(() => {
        var home = new GrafikaApp.Home();
        home.loadRandomAnimation();

        window['home'] = home;
    });
}