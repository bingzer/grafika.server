var GrafikaApp;
(function (GrafikaApp) {
    var RatingStarsDirective = (function () {
        function RatingStarsDirective(appCommon, animationService) {
            var _this = this;
            this.appCommon = appCommon;
            this.animationService = animationService;
            this.msgHtml = "";
            this.starHtml = "<div class=\"star\" style=\"display: inline\">\n                        <a href=\"javascript:void(0)\" class=\"full hidden md-icon-button\"><i class=\"material-icons\">star</i></a>\n                        <a href=\"javascript:void(0)\" class=\"half hidden md-icon-button\"><i class=\"material-icons\">star_half</i></a>\n                        <a href=\"javascript:void(0)\" class=\"empty hidden md-icon-button\"><i class=\"material-icons\">star_border</i></a>\n                    </div>";
            this.restrict = 'AE';
            this.link = function (scope, elem, attrs, ctr) {
                attrs.$observe('animationId', function (val) { return check('animationId', val); });
                attrs.$observe('rating', function (val) { return check('rating', val); });
                var animationId = scope['animationId'];
                var rating = parseInt(scope['rating']);
                var that = _this;
                function check(name, value) {
                    if (!value)
                        return;
                    if (name === 'animationId')
                        animationId = value;
                    if (name === 'rating')
                        rating = value;
                    if (!rating)
                        return;
                    evaluate();
                }
                function evaluate() {
                    if (!rating)
                        rating = 2.5;
                    var counter = 0;
                    var counterRating = rating;
                    var readonly = angular.isDefined(attrs['readonly']);
                    var classnames = attrs['class'];
                    elem.html('').attr('title', rating);
                    while (counter >= 0 && counter < 5) {
                        var html = jQuery(that.starHtml);
                        html.find(getClassByRating(counterRating))
                            .removeClass('hidden')
                            .addClass(classnames)
                            .data('value', counter + 1)
                            .find('i').addClass(classnames);
                        if (animationId && !readonly)
                            html.find('a').bind('click', function (e) { return rate(jQuery(e.target).parent()); });
                        if (readonly)
                            html.find('a').removeAttr('href');
                        elem.append(html);
                        if (counterRating > 0)
                            counterRating--;
                        counter++;
                    }
                }
                function getClassByRating(rating) {
                    if (rating >= 1)
                        return 'a.full';
                    else if (rating >= 0.5 && rating <= 1)
                        return 'a.half';
                    else
                        return 'a.empty';
                }
                function rate(elem) {
                    that.animationService.rate(animationId, elem.data('value')).then(function (res) {
                        rating = res.data;
                        evaluate();
                        that.appCommon.toast("Rating submitted");
                    });
                }
            };
        }
        RatingStarsDirective.factory = function () {
            var directive = function (appCommon, animationService) {
                return new RatingStarsDirective(appCommon, animationService);
            };
            directive.$inject = ['appCommon', 'animationService'];
            return directive;
        };
        return RatingStarsDirective;
    }());
    GrafikaApp.RatingStarsDirective = RatingStarsDirective;
})(GrafikaApp || (GrafikaApp = {}));
//# sourceMappingURL=rating-stars.js.map