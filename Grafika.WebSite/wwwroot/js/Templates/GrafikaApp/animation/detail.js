var __extends = (this && this.__extends) || (function () {
    var extendStatics = Object.setPrototypeOf ||
        ({ __proto__: [] } instanceof Array && function (d, b) { d.__proto__ = b; }) ||
        function (d, b) { for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p]; };
    return function (d, b) {
        extendStatics(d, b);
        function __() { this.constructor = d; }
        d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
    };
})();
var GrafikaApp;
(function (GrafikaApp) {
    var AnimationDetailController = (function (_super) {
        __extends(AnimationDetailController, _super);
        function AnimationDetailController(appCommon, appEnvironment, authService, uxService, animationService, frameService, resourceService) {
            var _this = _super.call(this, appCommon, authService, animationService, frameService, resourceService) || this;
            _this.uxService = uxService;
            _this.disqusReady = false;
            _this.canEdit = false;
            _this.relatedAnimationsLimit = 5;
            _this.isLoadingRelatedAnimations = true;
            _this.facebookAppId = appEnvironment.fbAppId;
            return _this;
        }
        AnimationDetailController.prototype.onLoaded = function (animation) {
            var _this = this;
            this.injectMetaTags();
            this.uxService.pageTitle = this.animation.name;
            this.disqusConfig = new GrafikaApp.DisqusConfig(this.appCommon, animation._id);
            this.disqusConfig.disqus_title = animation.name;
            this.disqusConfig.disqus_url = this.appCommon.$location.absUrl();
            this.disqusConfig.disqus_on_newcomment = function (comment) {
                _this.animationService.postNewComment(_this.animation, comment);
            };
            if (this.authService.isAuthorized('user')) {
                var user = this.authService.getUser();
                this.canEdit = user._id === this.animation.userId || user.roles.indexOf('administrator') > 0;
                this.authService.getDisqusToken().then(function (res) {
                    if (_this.authService.isAuthenticated()) {
                        //this.disqusConfig.disqus_category_id = 'Animation';
                        _this.disqusConfig.disqus_remote_auth_s3 = res.data.token;
                        _this.disqusReady = true;
                    }
                });
            }
            else {
                this.disqusReady = true;
            }
            this.sharing = {
                name: animation.name,
                imageUrl: animation.thumbnailUrl,
                description: animation.description,
                url: this.appCommon.appConfig.apiBaseUrl + "animations/" + animation._id + "/seo"
            };
            // related animations
            this.relatedAnimations = [];
            this.isLoadingRelatedAnimations = true;
            this.animationService.getRelated(animation._id).then(function (res) {
                // calculate the limit to show on the UI
                _this.appCommon.$mdMedia;
                _this.relatedAnimations = res.data;
            })["finally"](function () { return _this.isLoadingRelatedAnimations = false; });
            return this.appCommon.$q.when(animation);
        };
        AnimationDetailController.prototype.onError = function (err) {
            var _this = this;
            this.appCommon.alert(err).then(function () { return _this.appCommon.navigateHome(); });
        };
        AnimationDetailController.prototype.edit = function () {
            this.appCommon.$state.go("drawing", { _id: this.animation._id });
        };
        AnimationDetailController.prototype.editData = function (ev) {
            var _this = this;
            this.appCommon.showDialog('/app/animation/edit.html', 'AnimationEditController', ev).then(function () { return _this.load(); });
        };
        AnimationDetailController.prototype["delete"] = function () {
            var _this = this;
            return this.appCommon.confirm('Delete? This action is not reversible', this.animation.name).then(function () {
                return _this.animationService["delete"](_this.animation._id).then(function () {
                    _this.appCommon.navigateHome();
                    return _this.appCommon.toast('Deleted');
                });
            });
        };
        AnimationDetailController.prototype.injectMetaTags = function () {
            var title = this.escapeHtmlAttributes(this.animation.name);
            var desc = this.escapeHtmlAttributes(this.animation.description) + " - Grafika Animation";
            var url = this.appCommon.getBaseUrl() + '/animations/' + this.animation._id;
            // generic
            angular.element('head>meta[name="description"]').attr('content', desc);
            // google
            angular.element('head>meta[itemprop="name"]').attr('content', title);
            angular.element('head>meta[itemprop="description"]').attr('content', desc);
            // open graph
            angular.element('head>meta[property="og:url"]').attr('content', url);
            angular.element('head>meta[property="og:title"]').attr('content', title);
            angular.element('head>meta[property="og:description"]').attr('content', desc);
            angular.element('head').append("<meta property=\"og:image\" content=\"" + this.animation.thumbnailUrl + "\"/>");
            angular.element('head').append("<meta property=\"og:image:url\" content=\"" + this.animation.thumbnailUrl + "\"/>");
            angular.element('head').append("<meta property=\"og:image:width\" content=\"" + this.animation.width + "\"/>");
            angular.element('head').append("<meta property=\"og:image:height\" content=\"" + this.animation.height + "\"/>");
            // twitter
            angular.element('head>meta[name="twitter:title"]').attr('content', title);
            angular.element('head>meta[name="twitter:description"]').attr('content', desc);
            angular.element('head').append("<meta property=\"twitter:image\" content=\"" + this.animation.thumbnailUrl + "\"/>");
        };
        AnimationDetailController.prototype.escapeHtmlAttributes = function (text) {
            if (!text)
                return "";
            text = text.replace(/\'/g, '');
            text = text.replace(/\"/g, '');
            text = text.replace(/\n/g, '');
            return text;
        };
        AnimationDetailController.prototype.getFacebookSharingHtml = function () {
            return "<iframe ng-src=\"https://www.facebook.com/plugins/share_button.php?href=" + this.sharing.url + "&layout=button_count&size=small&mobile_iframe=true&appId=" + this.appCommon.appConfig.fbAppId + "&width=86&height=20\" width=\"86\" height=\"20\" style=\"border:none;overflow:hidden\" scrolling=\"no\" frameborder=\"0\" allowTransparency=\"true\"></iframe>";
        };
        AnimationDetailController.$inject = ['appCommon', 'appEnvironment', 'authService', 'uxService', 'animationService', 'frameService', 'resourceService'];
        return AnimationDetailController;
    }(GrafikaApp.BaseAnimationController));
    GrafikaApp.AnimationDetailController = AnimationDetailController;
})(GrafikaApp || (GrafikaApp = {}));
