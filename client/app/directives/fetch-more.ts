 module GrafikaApp {
    export class FetchMoreDirective implements ng.IDirective {
        restrict = 'AE';
        template = `<div layout="row" layout-align="center center" layout-margin flex>
                        <gf-spinner ng-show="vm.busy"></gf-spinner>
                        <md-button class="md-button md-icon-button" ng-click="vm.list()" ng-disabled="vm.fetching" ng-show="vm.canLoadMore">
                            <md-icon md-font-library="material designs">expand_more</md-icon>
                            <md-tooltip>Load more...</md-tooltip>
                        </md-button>
                    </div>`
        
        constructor() {
        }
        
        static factory(): ng.IDirectiveFactory {
            const directive = () => new FetchMoreDirective();
            return directive;
        }
    }
 }