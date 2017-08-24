module GrafikaApp {
    export class ValidationResult {
        errors: string[] = [];

        constructor() {
            
        }

        addError = (error: string) => this.errors.push(error);
        clear = () => this.errors = [];
    }
}