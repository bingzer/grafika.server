var GrafikaApp;
(function (GrafikaApp) {
    var AvatarDirective = (function () {
        function AvatarDirective(appCommon, animationService) {
            var _this = this;
            this.appCommon = appCommon;
            this.animationService = animationService;
            this.avatarHtml = "<a class=\"md-subtitle link\">\n                        <img>\n                        <span></span>\n                     </a>";
            this.restrict = 'AE';
            this.link = function (scope, elem, attrs, ctr) {
                attrs.$observe('userId', function (val) { return check('userId', val); });
                attrs.$observe('username', function (val) { return check('username', val); });
                var userId = scope["userId"];
                var username = scope["username"];
                var that = _this;
                function check(name, value) {
                    if (!value)
                        return;
                    if (name === 'userId')
                        userId = value;
                    if (name === 'username')
                        username = value;
                    if (!userId)
                        return;
                    evaluate();
                }
                function evaluate() {
                    var classnames = attrs["class"] || 'avatar';
                    elem.html('').removeAttr('class');
                    var html = jQuery(that.avatarHtml);
                    html.attr('href', "users/" + userId).attr('title', 'Navigate to this user');
                    html.find('img').attr('src', "api/users/" + userId + "/avatar").addClass(classnames);
                    html.find('span').text(username);
                    elem.append(html);
                }
            };
        }
        AvatarDirective.factory = function () {
            var directive = function (appCommon, animationService) {
                return new AvatarDirective(appCommon, animationService);
            };
            directive.$inject = ['appCommon', 'animationService'];
            return directive;
        };
        return AvatarDirective;
    }());
    GrafikaApp.AvatarDirective = AvatarDirective;
})(GrafikaApp || (GrafikaApp = {}));
//# sourceMappingURL=avatar.js.map