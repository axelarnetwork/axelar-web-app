export const getShortenedWord = (str: string | undefined): string => {
	if (!str)
		return "TBD";
	if (str.length < 10)
		return str;
	return str.substring(0, 4) + "..." + str.substring(str.length - 4, str.length);
}

