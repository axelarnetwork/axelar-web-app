export const getShortenedWord = (str: string | undefined): string => {
	if (!str)
		return "TBD";
	if (str.length < 10)
		return str;
	return str.substring(0,3) + "..." + str.substring(str.length - 5, str.length);
}

