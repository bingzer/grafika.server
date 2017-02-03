
export function safeParseInt(num: string){
	let i = parseInt(num);
	if (isNaN(i)) i = -1;
	return i;
}

export function randomlyPick<T>(any: T[]): T {
	let randomIndex = Math.floor(Math.random() * any.length);
	return any[randomIndex];
}

export function replaceCharacters(any: string, find: string | string[], replace: string){
	if (!any) return any;
	if (typeof(find) === 'string')
		find = [find];

	let data;
	for(var i = 0; i < find.length; i++){
		data = any.replace(new RegExp(find[i], 'g'), replace);
	}
	return data;
}