var GrafikaApp;
(function (GrafikaApp) {
    function KeyboardFilter($window) {
        return function (str) {
            if (!str)
                return;
            var keys = str.split('-');
            var isOSX = /Mac OS X/.test($window.navigator.userAgent);
            var seperator = (!isOSX || keys.length > 2) ? '+' : '';
            var abbreviations = {
                M: isOSX ? '⌘' : 'Ctrl',
                A: isOSX ? 'Option' : 'Alt',
                S: 'Shift'
            };
            return keys.map(function (key, index) {
                var last = index == keys.length - 1;
                return last ? key : abbreviations[key];
            }).join(seperator);
        };
    }
    GrafikaApp.KeyboardFilter = KeyboardFilter;
})(GrafikaApp || (GrafikaApp = {}));
//# sourceMappingURL=keyboard.js.map