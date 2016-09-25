module GrafikaApp {
    export class Feedback {
        category: string;
        subject: string;
        content: string;

        public static categories: string[] = ['Just saying Hi!', 'Bug', 'Features', 'Web Site Feedback', 'App Feedback', 'Other'];
    }
}