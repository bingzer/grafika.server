module GrafikaApp {
    export class AnimationDetailController extends BaseAnimationController {
        disqusReady: boolean = false;
        canEdit: boolean = false;
        disqusConfig: DisqusConfig;
        sharing: ShareData;
        relatedAnimations: Grafika.IAnimation[];
        relatedAnimationsLimit: Number = 5;
        isLoadingRelatedAnimations: boolean = true;
        facebookAppId: string;

        public static $inject = ['appCommon', 'appEnvironment', 'authService', 'uxService', 'animationService', 'frameService', 'resourceService'];
        constructor(
            appCommon: AppCommon,
            appEnvironment: any,
            authService: AuthService, 
            private uxService: UxService,
            animationService: AnimationService, 
            frameService: FrameService, 
            resourceService: ResourceService){
            super(appCommon, authService, animationService, frameService, resourceService);
            this.facebookAppId = appEnvironment.fbAppId;
        }
        
        onLoaded(animation: Grafika.IAnimation): ng.IPromise<any>{
            this.injectMetaTags();

            this.uxService.pageTitle = this.animation.name;
            this.disqusConfig = new DisqusConfig(this.appCommon, animation._id);
            this.disqusConfig.disqus_title = animation.name;
            this.disqusConfig.disqus_url = this.appCommon.$location.absUrl();
            this.disqusConfig.disqus_on_newcomment = (comment) => {
                this.animationService.postNewComment(this.animation, comment);
            };

            if (this.authService.isAuthorized('user')){
                let user = this.authService.getUser();
                this.canEdit = user._id === this.animation.userId || user.roles.indexOf('administrator') > 0;
                this.authService.getDisqusToken().then((res) => {
                    if (this.authService.isAuthenticated()){
                        //this.disqusConfig.disqus_category_id = 'Animation';
                        this.disqusConfig.disqus_remote_auth_s3 = res.data.token;
                        this.disqusReady = true;
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
                url: `${this.appCommon.appConfig.apiBaseUrl}animations/${animation._id}/seo`
            };

            // related animations
            this.relatedAnimations = [];
            this.isLoadingRelatedAnimations = true;
            this.animationService.getRelated(animation._id).then((res) => {
                // calculate the limit to show on the UI
                this.appCommon.$mdMedia
                this.relatedAnimations = res.data;
            }).finally(() => this.isLoadingRelatedAnimations = false);

            return this.appCommon.$q.when(animation);
        }

        onError(err: any){
            this.appCommon.alert(err).then(() => this.appCommon.navigateHome());
        }

        edit() {
            this.appCommon.$state.go("drawing", {_id: this.animation._id});
        }

        editData(ev: MouseEvent) {
            this.appCommon.showDialog('/app/animation/edit.html', 'AnimationEditController', ev).then(() => this.load());
        }

        delete(): ng.IPromise<any> {
            return this.appCommon.confirm('Delete? This action is not reversible', this.animation.name).then(() => {
                return this.animationService.delete(this.animation._id).then(() => {
                    this.appCommon.navigateHome();
                    return this.appCommon.toast('Deleted');
                });
            });
        }

        private injectMetaTags() {
            let title = this.escapeHtmlAttributes(this.animation.name);
            let desc = this.escapeHtmlAttributes(this.animation.description) + " - Grafika Animation";
            let url =  this.appCommon.getBaseUrl() + '/animations/' + this.animation._id;
            // generic
            angular.element('head>meta[name="description"]').attr('content', desc);
            // google
            angular.element('head>meta[itemprop="name"]').attr('content', title);
            angular.element('head>meta[itemprop="description"]').attr('content', desc);
            // open graph
            angular.element('head>meta[property="og:url"]').attr('content', url);
            angular.element('head>meta[property="og:title"]').attr('content', title);
            angular.element('head>meta[property="og:description"]').attr('content', desc);
            angular.element('head').append(`<meta property="og:image" content="${this.animation.thumbnailUrl}"/>`);
            angular.element('head').append(`<meta property="og:image:url" content="${this.animation.thumbnailUrl}"/>`);
            angular.element('head').append(`<meta property="og:image:width" content="${this.animation.width}"/>`);
            angular.element('head').append(`<meta property="og:image:height" content="${this.animation.height}"/>`);
            // twitter
            angular.element('head>meta[name="twitter:title"]').attr('content', title);
            angular.element('head>meta[name="twitter:description"]').attr('content', desc);
            angular.element('head').append(`<meta property="twitter:image" content="${this.animation.thumbnailUrl}"/>`);
        }

        private escapeHtmlAttributes(text: string): string {
            if (!text) return "";
            text = text.replace(/\'/g, '');
            text = text.replace(/\"/g, '');
            text = text.replace(/\n/g, '');
            return text;
        }

        getFacebookSharingHtml(){
            return `<iframe ng-src="https://www.facebook.com/plugins/share_button.php?href=${this.sharing.url}&layout=button_count&size=small&mobile_iframe=true&appId=${this.appCommon.appConfig.fbAppId}&width=86&height=20" width="86" height="20" style="border:none;overflow:hidden" scrolling="no" frameborder="0" allowTransparency="true"></iframe>`
        }
    }
}