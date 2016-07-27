module GrafikaApp {
    export class ActiveLinkDirective implements ng.IDirective {
        restrict = 'A';
        link = (scope: ng.IScope, element: ng.IAugmentedJQuery, attrs: ng.IAttributes, ctr: any) => {
            let clazz = attrs['activeLink'];
            let path = attrs['href'];
            path = path.substring(1);

            scope['location'] = this.$location;
            scope.$watch('location.path()', (newPath: string) => {
                while (newPath.length > 0 && newPath.substring(0, 1) == '/')
                    newPath = newPath.substring(1);

                if (path == newPath) {
                    element.addClass(clazz);
                }
                else {
                    element.removeClass(clazz);
                }
            });
        };
        
        constructor(private $location: ng.ILocationService) {
        }
        
        static factory(): ng.IDirectiveFactory {
            const directive = ($location: ng.ILocationService) => new ActiveLinkDirective($location);
            directive.$inject = ['$location'];
            return directive;
        }
    }
}