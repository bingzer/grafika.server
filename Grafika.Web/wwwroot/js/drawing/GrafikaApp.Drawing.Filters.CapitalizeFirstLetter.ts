module GrafikaApp {
    export module Drawing {
        export module Filters {
            export function CapitalizeFirstLetterFilter() {
                return (input) => {
                    return (!!input) ? input.charAt(0).toUpperCase() + input.substr(1).toLowerCase() : '';
                };
            }
        }
    }
}