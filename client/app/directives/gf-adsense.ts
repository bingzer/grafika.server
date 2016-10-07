 module GrafikaApp {
    export class GfAdsense implements ng.IDirective {
        restrict = 'AE';
        templateDisable = `<div style="width: 100%; display: inline-block;" layout-padding layout-align="center">
                            <span style="display: block; text-align: center; color: gray">No Ads (disabled)</span>
                           </div>`;
        templateAdsense = `<div style="width: 100%; display: inline-block" layout-padding>
                            <adsense
                                ad-client="ca-pub-6423861965667645"
                                ad-slot="2335720328"
                                inline-style="display:block" ad-format="auto"></adsense>
                           </div>`;
        template = this.resolveTemplate;
        
        constructor(private appCommon: AppCommon) {
        }

        resolveTemplate(): string{
            let enabled = this.appCommon.$location.host().indexOf('localhost') < 0;
            if (enabled)
                return this.templateAdsense;
            else return this.templateDisable;
        }
        
        static factory(): ng.IDirectiveFactory {
            const directive = (appCommon: AppCommon) => new GfAdsense(appCommon);
            directive.$inject = ['appCommon'];
            return directive;
        }
    }
 }