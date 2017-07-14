var GrafikaApp;
(function (GrafikaApp) {
    function CapitalizeFirstLetterFilter() {
        return function (input) {
            return (!!input) ? input.charAt(0).toUpperCase() + input.substr(1).toLowerCase() : '';
        };
    }
    GrafikaApp.CapitalizeFirstLetterFilter = CapitalizeFirstLetterFilter;
})(GrafikaApp || (GrafikaApp = {}));
//# sourceMappingURL=C:/Users/ricky/GrafikaProject/grafika.server/Grafika.WebSite/Tempaltes/GrafikaApp/output/filters/capitalize-first-letter.js.map