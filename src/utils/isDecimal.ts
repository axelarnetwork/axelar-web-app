export const isDecimal = (input: string) => {
	return (/^\d+\.\d{0,6}$/.test(input));
}