import { store } from 'react-notifications-component';

const getErrorType = (error: any): string => {

	const unexpectedErrorMsg: string = "An error occurred connecting to the network. Please try again later.";
	if (error.uncaught)
		return unexpectedErrorMsg;

	const errorsMap: { [statusCode: number]: string} = {
		503: "Service unavailable. TODO"
	};

	debugger;

	if (errorsMap[error.statusCode])
		return errorsMap[error.statusCode];

	return unexpectedErrorMsg;

}

const ErrorHandler = () => {

	const notifyError = (error: any) => {

		const notification = getErrorType(error);

		store.addNotification({
			title: "Error",
			message: notification,
			type: "danger",
			insert: "top",
			container: "top-right",
			animationIn: ["animate__animated", "animate__fadeIn"],
			animationOut: ["animate__animated", "animate__fadeOut"],
			dismiss: {
				duration: 5000,
				onScreen: false
			}
		});
	}

	return {
		notifyError
	} as const;
}

export default ErrorHandler;