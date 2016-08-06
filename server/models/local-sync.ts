
/**
 * Entity we get from the client
 */
export interface ILocalSync {
    clientId           : string,
    animations         : Grafika.IAnimation[],
    tombstones         : Grafika.IAnimation[]
}