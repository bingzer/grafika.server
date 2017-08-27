module GrafikaApp {
    export module Drawing {
        export module Directives {
            export class ContextMenuDirective implements ng.IDirective {
                restrict = 'A';
                scope = true;
                transclude = false;
                link = (scope: ng.IScope, element: ng.IAugmentedJQuery, attrs: ng.IAttributes, ctr: any) => {
                    let ulId = '#' + attrs['contextMenu'];
                    let ul = jQuery(ulId).css({ display: 'none' });
                    let last = null;
                    let xscope = scope;
                    let body = jQuery(document.body);
                    ul.parent().remove(ulId);  // remove from current parent
                    jQuery('body').append(ul); // append to body

                    jQuery(element).on('contextmenu', (event) => {
                        ul.css({ position: "fixed", display: "block", left: event.clientX + 'px', top: event.clientY + 'px', zIndex: 3000 });
                        if (ul.position().top + ul.height() > body.offset().top + body.height()) {
                            let top = ul.position().top - ul.height();
                            if (top > 5) ul.css({ top: ul.position().top - ul.height() });
                        }
                        xscope.$apply();
                        event.preventDefault();
                    });

                    jQuery(document).click((event) => {
                        let target = jQuery(event.target);
                        if (!target.is(".popover") && !target.parents().is(".popover")) {
                            if (last === event.timeStamp) return;
                            ul.css({ 'display': 'none' });
                        }
                    });
                };

                constructor() {
                }

                static factory(): ng.IDirectiveFactory {
                    const directive = () => new ContextMenuDirective();
                    return directive;
                }
            }
        }
    }
}