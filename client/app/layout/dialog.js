var GrafikaApp;
(function (GrafikaApp) {
    var DialogController = (function () {
        function DialogController($mdDialog) {
            this.$mdDialog = $mdDialog;
        }
        DialogController.prototype.close = function (response) {
            this.$mdDialog.hide(response);
        };
        DialogController.prototype.cancel = function () {
            this.$mdDialog.cancel();
        };
        DialogController.$inject = [
            '$mdDialog'
        ];
        return DialogController;
    }());
    GrafikaApp.DialogController = DialogController;
})(GrafikaApp || (GrafikaApp = {}));
//# sourceMappingURL=dialog.js.map