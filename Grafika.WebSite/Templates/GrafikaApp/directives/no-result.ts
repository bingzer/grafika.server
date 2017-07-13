 module GrafikaApp {
    export class NoResultDirective implements ng.IDirective {
        restrict = 'AE';
        template = `<div layout-fill layout="column" layout-align="center center" style="margin-top: 32px">
                        <img src="/content/images/sad_lightgray_128.png">
                        <div class="md-subtitle" style="color: #d3d3d3; margin-top: 16px">No results</div>
                    </div>`
        
        constructor() {
        }
        
        static factory(): ng.IDirectiveFactory {
            const directive = () => new NoResultDirective();
            return directive;
        }
    }
 }