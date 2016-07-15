/**
 * Suppress errors
 */
// declare namespace angular {
//     export interface JQueryStatic {
//         (any: any);
//     }
// }

declare namespace nodemailer {
    export interface Transport {

    }
    export interface SendMailOptions {
        
    }
    export interface SentMessageInfo {
        response: any;
    }
}

declare module 'nodemailer-direct-transport'{
    export class DirectOptions {

    }
}
declare module 'nodemailer-smtp-transport'{
    export class SmtpOptions {
        
    }
}