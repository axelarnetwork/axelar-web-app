export const getShortenedWord = (str: string | undefined, truncation = 4): string => {
	if (!str)
		return "TBD";
	if (str.length < 10)
		return str;
	return str.substring(0, truncation) + " ... " + str.substring(str.length - truncation, str.length);
}

