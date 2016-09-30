 module GrafikaApp {
    export class GfAdsense implements ng.IDirective {
        restrict = 'AE';
        template = `<div style="width: 100%; display: inline-block" layout-padding>
                        <adsense
                            ad-client="ca-pub-6423861965667645"
                            ad-slot="2335720328"
                            inline-style="display:block" ad-format="auto"></adsense>
                    </div>`
        
        constructor() {
        }
        
        static factory(): ng.IDirectiveFactory {
            const directive = () => new GfAdsense();
            return directive;
        }
    }
 }