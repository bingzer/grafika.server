module GrafikaApp {
    export class ImageData implements IImageData {
        constructor(
            public name: string,
            public size: number,
            public mime: string,
            public blob?: () => Blob | any
        ){
            // nothing
        }

        getBlob(): Blob | any {
            return this.blob();
        }
    }

    export interface IImageData {
        name: string;
        size: number;
        mime: string;

        getBlob(): Blob | any;
    }
}