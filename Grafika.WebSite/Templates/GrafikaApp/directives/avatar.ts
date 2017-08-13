 module GrafikaApp {
    export class AvatarDirective implements ng.IDirective {
        avatarHtml = `<a class="md-subtitle link">
                        <img>
                        <span></span>
                     </a>`

        restrict = 'AE';
        link = (scope: ng.IScope, elem: ng.IAugmentedJQuery, attrs: ng.IAttributes, ctr: any) => {
            attrs.$observe('userId', (val) => check('userId', val));
            attrs.$observe('username', (val) => check('username', val));

            let userId: string = scope["userId"];
            let username: string = scope["username"];
            let that = this;

            function check(name, value){
                if (!value) return;
                if (name === 'userId')
                    userId = value;
                if (name === 'username')
                    username = value;

                if (!userId)
                    return;

                evaluate();
            }

            function evaluate(){
                let classnames: string = attrs["class"] || 'avatar';
                
                elem.html('').removeAttr('class');

                let html = jQuery(that.avatarHtml);
                let apiUrl = that.appCommon.appConfig.apiBaseUrl;
                html.attr('href', `users/${userId}`).attr('title', 'Navigate to this user');
                html.find('img').attr('src', `${apiUrl}users/${userId}/avatar`).addClass(classnames);
                html.find('span').text(username);

                elem.append(html);
            }
        };

        constructor(private appCommon: AppCommon, 
                    private animationService: AnimationService) {
            // -- do nothing
        }
        
        static factory(): ng.IDirectiveFactory {
            const directive = (appCommon: AppCommon, animationService: AnimationService) => 
                new AvatarDirective(appCommon, animationService);
            directive.$inject = ['appCommon', 'animationService'];
            return directive;
        }
    }
 }