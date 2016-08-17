 module GrafikaApp {
    export class IncludeMarkdownDirective implements ng.IDirective {
        restrict = 'AE';
        scope = {
            markdownUrl: '='
        };
        bindToController = true;
        controllerAs = 'vm';
        controller = IncludeMarkdownController;
        
        constructor() {
        }
        
        static factory(): ng.IDirectiveFactory {
            const directive = () => new IncludeMarkdownDirective();
            return directive;
        }
    }

    class IncludeMarkdownController {
        markdownUrl: string;

        static $inject = ['appCommon', '$element', '$http'];
        constructor(
            private appCommon: AppCommon,
            private $element: JQuery, 
            private $http: ng.IHttpService) {

            this.$element.html('<p style="width: 100%">Loading markdown...</p>')
			$http.get<string>(this.markdownUrl).then((res) => this.render(res)).catch((res) => this.renderError());
        }

        render(res: ng.IHttpPromiseCallbackArg<string>): ng.IPromise<any> {
            let defer = this.appCommon.$q.defer();
            
            this.appCommon.$timeout(() => {
                if (!res) defer.reject();
                else {
                    let html = markdown.toHTML(res.data);
                    this.$element.html('<div>' + html + '</div>');
                    defer.resolve();
                }
            }, 500);

            return defer.promise;
        }

        renderError(): ng.IPromise<any> {
            let defer = this.appCommon.$q.defer();
            
            this.appCommon.$timeout(() => {
                let html = '<p class="md-warn">Unable to retrieve data</p>';
                this.$element.html('<div>' + html + '</div>');
                defer.resolve();
            }, 500);

            return defer.promise;
        }
    }
 }