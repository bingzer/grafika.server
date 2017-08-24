 module GrafikaApp {
    export class GfSpinner implements ng.IDirective {
        restrict = 'AE';
        template = `<div class="gf-spinner">
                        <div class="rect1"></div>
                        <div class="rect2"></div>
                        <div class="rect3"></div>
                        <div class="rect4"></div>
                        <div class="rect5"></div>
                    </div>`
        
        constructor() {
        }
        
        static factory(): ng.IDirectiveFactory {
            const directive = () => new GfSpinner();
            return directive;
        }
    }
 }