var GrafikaApp;
(function (GrafikaApp) {
    var PasswordValidator = (function () {
        function PasswordValidator() {
        }
        PasswordValidator.prototype.validate = function (password) {
            var result = new GrafikaApp.ValidationResult();
            if (!password || password.length == 0)
                result.addError("Password is required");
            else {
                if (password.length < PasswordValidator.MINIMUM_CHARACTER_LENGTH)
                    result.addError(PasswordValidator.MINIMUM_CHARACTER_LENGTH + " characters in length");
                if (!(/.*[A-Z].*/.test(password)))
                    result.addError("1 UPPERCASE");
                if (!(/.*[a-z].*/.test(password)))
                    result.addError("1 lowercase");
                if (!(/.*[0-9].*/.test(password)))
                    result.addError("1 number");
                if (!(/.*[\W].*/.test(password)))
                    result.addError("1 special characters");
            }
            return result;
        };
        PasswordValidator.prototype.validatePassword = function (password) {
            var message = "";
            var result = this.validate(password);
            for (var i = 0; i < result.errors.length; i++) {
                message += result.errors[i];
                if (i < result.errors.length - 1)
                    message += ",";
            }
            return message;
        };
        return PasswordValidator;
    }());
    PasswordValidator.MINIMUM_CHARACTER_LENGTH = 6;
    GrafikaApp.PasswordValidator = PasswordValidator;
})(GrafikaApp || (GrafikaApp = {}));
//# sourceMappingURL=C:/Users/ricky/GrafikaProject/grafika.server/Grafika.WebSite/Tempaltes/GrafikaApp/output/models/password-validator.js.map