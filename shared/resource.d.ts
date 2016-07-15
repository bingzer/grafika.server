declare namespace Grafika {
    
    /**
     * Signed URL from AWS
     */
    export interface ISignedUrl {
        signedUrl: string;
        mime: string;	
    }

    /**
     * Base contract for a resource
     */
    interface IResource {
        _id: any | string;
        animationId: string;
        mime: string;
    }
}