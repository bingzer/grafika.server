var GrafikaApp;
(function (GrafikaApp) {
    var Feedback = (function () {
        function Feedback() {
        }
        Feedback.categories = ['Just saying Hi!', 'Bug', 'Features', 'Web Site Feedback', 'App Feedback', 'Other'];
        return Feedback;
    }());
    GrafikaApp.Feedback = Feedback;
})(GrafikaApp || (GrafikaApp = {}));
