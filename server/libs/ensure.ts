export function notNullOrEmpty(any: string, name?: string) : void{
    if (any == null) throw new Error(name);
    if (any.length == 0) throw new Error(name);
}