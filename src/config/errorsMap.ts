export const getErrorMessage: (errorCode: number, error: any) => string = (errorCode: number, error: any) => {

	const errorsMap: { [statusCode: number]: string} = {
		503: `Unexpected error occurred, try again later.`,
		403: error.message + "; Refresh this page and try again.", //handle recaptcha error
		400: error.message + "; Check your inputs and try again.", //handle bad request error
	};

	if (errorsMap[errorCode])
		return errorsMap[errorCode];

	return errorsMap[503];

};