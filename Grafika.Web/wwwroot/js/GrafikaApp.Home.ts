module GrafikaApp {
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

    // Initialize and Configure Magnific Popup Lightbox Plugin
    $('.popup-gallery').magnificPopup({
        delegate: 'a',
        type: 'ajax',
        closeMarkup: '<button title= "%title%" type= "button" class="mfp-close" style="margin-top: -40px; margin-right: -16px; color: white" >&#215;</button>',
        mainClass: 'preview-animation-popup'
    });

    // jQuery for page scrolling feature - requires jQuery Easing plugin
    $(document).on('click', 'a.page-scroll', function (event) {
        let $anchor = $(this);
        $('html, body').stop().animate({
            scrollTop: ($($anchor.attr('href')).offset().top - 50)
        }, 1250, 'easeInOutExpo');
        event.preventDefault();
    });

    export class Home {
        public animPlayer: GrafikaApp.Player;

        public loadRandomAnimation(): Q.IPromise<any> {
            jQuery('#btn-random-animation').attr('disabled', 'disabled');

            if (!this.animPlayer)
                this.animPlayer = new GrafikaApp.Player('#header-canvas');
            let element = jQuery('#random-animation-author');
            if (element.text().trim().length > 0)
                element.fadeOut();

            return jQuery.ajax({ url: `${GrafikaApp.Configuration.baseApiUrl}/animations?isRandom=true&isPublic=true`, cache: false }).done((res) => {
                let animation = res[0] as Grafika.IAnimation;
                let slug = GrafikaApp.generateSlug(animation.name);
                element.html(`<a href="/animations/${animation._id}/${slug}" title="View this animation">${animation.name} by ${animation.author}</a>`).fadeIn();
                return this.animPlayer.loadAnimation(animation._id).then(() => {
                    jQuery('#btn-random-animation').removeAttr('disabled');
                    return this.animPlayer.play();
                });
            });
        }
    }

    $(document).ready(() => {
        let home = new GrafikaApp.Home();
        window['home'] = home;

        setTimeout(() => {
            home.loadRandomAnimation();
        }, 1000);
    });
}