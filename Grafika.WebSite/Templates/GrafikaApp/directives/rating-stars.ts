 module GrafikaApp {
    export class RatingStarsDirective implements ng.IDirective {
        msgHtml = ``;
        starHtml = `<div class="star" style="display: inline">
                        <a href="javascript:void(0)" class="full hidden md-icon-button"><i class="material-icons">star</i></a>
                        <a href="javascript:void(0)" class="half hidden md-icon-button"><i class="material-icons">star_half</i></a>
                        <a href="javascript:void(0)" class="empty hidden md-icon-button"><i class="material-icons">star_border</i></a>
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

                if (!rating)
                    return;

                evaluate();
            }

            function evaluate(){
                if (!rating) rating = 2.5;

                let counter = 0;
                let counterRating = rating;
                let readonly = angular.isDefined(attrs['readonly']);
                let classnames = attrs['class'];

                elem.html('').attr('title', rating);
                while (counter >= 0 && counter < 5) {
                    let html = jQuery(that.starHtml);

                    html.find(getClassByRating(counterRating))
                        .removeClass('hidden')
                        .addClass(classnames)
                        .data('value', counter + 1)
                        .find('i').addClass(classnames);
                    if (animationId && !readonly)
                        html.find('a').bind('click', (e) => rate(jQuery(e.target).parent()))
                    if (readonly)
                        html.find('a').removeAttr('href');
                    elem.append(html);

                    if (counterRating > 0)
                        counterRating--;
                    counter++;
                }
            }

            function getClassByRating(rating: number): string {
                if (rating >= 1) return 'a.full';
                else if(rating >= 0.5 && rating <= 1) return 'a.half';
                else return 'a.empty';
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