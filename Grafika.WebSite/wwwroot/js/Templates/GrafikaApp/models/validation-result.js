var GrafikaApp;
(function (GrafikaApp) {
    var ValidationResult = (function () {
        function ValidationResult() {
            var _this = this;
            this.errors = [];
            this.addError = function (error) { return _this.errors.push(error); };
            this.clear = function () { return _this.errors = []; };
        }
        return ValidationResult;
    }());
    GrafikaApp.ValidationResult = ValidationResult;
})(GrafikaApp || (GrafikaApp = {}));
