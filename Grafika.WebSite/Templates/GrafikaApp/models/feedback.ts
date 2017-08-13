module GrafikaApp {
    export class Feedback {
        category: string;
        subject: string;
        content: string;
        email: string;
        lean: boolean;

        public static categories: string[] = ['Just saying Hi!', 'Bug', 'Features', 'Web Site Feedback', 'App Feedback', 'Other'];
    }
}