declare namespace Grafika {
	
    export interface IBackground extends IDrawable {
        _id: any | string;
        localId: string;
        type: string;
        name: string;
        description: string;
        width: number;
        height: number;
        dateCreated: number;
        dateModified: number;
        category: string;
        isPublic: boolean;
        author: string;
        userId: string;
        thumbnailUrl: string;
        client?: IClient;
    }
    
    /**
     * Signed URL from AWS
     */
    export interface ISignedUrl {
        signedUrl: string;
        mime: string;	
    }
}