﻿module GrafikaApp {
    export module Drawing {
        export function Theme($mdThemingProvider: ng.material.IThemingProvider): void {
            $mdThemingProvider.definePalette('teal', {
                '50': '#8affff',
                '100': '#3effff',
                '200': '#06ffff',
                '300': '#00bdbd',
                '400': '#009f9f',
                '500': '#008080',
                '600': '#006161',
                '700': '#004343',
                '800': '#002424',
                '900': '#000606',
                'A100': '#8affff',
                'A200': '#3effff',
                'A400': '#009f9f',
                'A700': '#004343',
                'contrastDefaultColor': 'light',
                'contrastDarkColors': '50 100 200 300 A100 A200'
            });

            $mdThemingProvider.theme('default').primaryPalette('teal');
        }
    }
}