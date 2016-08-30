
export function safeParseInt(num: string){
	let i = parseInt(num);
	if (isNaN(i)) i = -1;
	return i;
}

export function randomlyPick<T>(any: T[]): T {
	let randomIndex = Math.floor(Math.random() * any.length);
	return any[randomIndex];
}