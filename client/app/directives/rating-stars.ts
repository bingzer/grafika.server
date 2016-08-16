 module GrafikaApp {
    export class RatingStarsDirective implements ng.IDirective {
        msgHtml = ``;
        starHtml = `<div class="star" style="display: inline">
                        <a href="javascript:void(0)" class="full hidden" class="md-icon-button"><i class="material-icons">star</i></a>
                        <a href="javascript:void(0)" class="half hidden" class="md-icon-button"><i class="material-icons">star_half</i></a>
                        <a href="javascript:void(0)" class="empty hidden" class="md-icon-button"><i class="material-icons">star_border</i></a>
                    </div>`

        restrict = 'AE';
        // scope = {
        //     animationId: '@animationId',
        //     rating: '@rating'
        // };
        link = (scope: ng.IScope, elem: ng.IAugmentedJQuery, attrs: ng.IAttributes, ctr: any) => {
            attrs.$observe('animationId', (val) => check('animationId', val));
            attrs.$observe('rating', (val) => check('rating', val));

            let animationId: string = scope['animationId'];
            let rating: number = parseInt(scope['rating']);
            let that = this;

            function check(name, value){
                if (!value) return;
                if (name === 'animationId')
                    animationId = value;
                if (name === 'rating')
                    rating = value;

                if (!animationId || !rating)
                    return;

                evaluate();
            }

            function evaluate(){
                let counter = 0;
                if (!rating) rating = 2.5;
                elem.html('');
                while (counter >= 0 && counter < 5) {
                    let html = jQuery(that.starHtml);
                    // full star
                    if (rating >= 1) {
                        html.find('.full').removeClass("hidden")
                            .attr('title', counter + 1)
                            .data('value', counter + 1).bind('click', (e) => rate(jQuery(e.target).parent()));
                    }
                    // half star
                    else if (rating >= 0.5 && rating <= 1){
                        html.find('.half').removeClass("hidden")
                            .attr('title', counter + 1)
                            .data('value', counter + 1).bind('click', (e) => rate(jQuery(e.target).parent()));
                    }
                    // empty
                    else {
                        html.find('.empty').removeClass("hidden")
                            .attr('title', counter + 1)
                            .data('value', counter + 1).bind('click', (e) => rate(jQuery(e.target).parent()));
                    }
                    elem.append(html);

                    if (rating > 0)
                        rating--;
                    counter++;
                }
            }

            function rate(elem) {
                that.animationService.rate(animationId, elem.data('value')).then((res) => {
                    rating = res.data;
                    evaluate();
                    that.appCommon.toast("Rating submitted");
                });
            }
        };

        constructor(private appCommon: AppCommon, 
                    private animationService: AnimationService) {
            // -- do nothing
        }
        
        static factory(): ng.IDirectiveFactory {
            const directive = (appCommon: AppCommon, animationService: AnimationService) => 
                new RatingStarsDirective(appCommon, animationService);
            directive.$inject = ['appCommon', 'animationService'];
            return directive;
        }
    }
 }