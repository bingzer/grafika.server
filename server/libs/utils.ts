
export function safeParseInt(num: string){
	let i = parseInt(num);
	if (isNaN(i)) i = -1;
	return i;
}