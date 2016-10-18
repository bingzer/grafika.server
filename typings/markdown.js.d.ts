declare var markdown: Markdown.IMarkdownStatic;

declare namespace Markdown {
    export interface IMarkdownStatic {
        toHTML(data: any): string;
    }
}