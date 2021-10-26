export const toProperCase = (str: string) => {
	let upper = true;
	let newStr = "";
	for (let i = 0, l = str.length; i < l; i++) {
		if (str[i] == " ") {
			upper = true
			newStr += str[i]
			continue
		}
		newStr += upper ? str[i].toUpperCase() : str[i].toLowerCase()
		upper = false
	}
	return newStr
}