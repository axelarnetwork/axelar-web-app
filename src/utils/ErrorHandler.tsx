import { store }       from 'react-notifications-component';
import 'react-notifications-component/dist/theme.css';
import 'animate.css/animate.min.css';
import Tooltip         from "../component/Widgets/Tooltip";
import CopyToClipboard from "../component/Widgets/CopyToClipboard";

const traceIdDiv = (traceId: string | undefined) => {
	if (!traceId)
		return null;
	return <div>You can also contact us with this traceId: <Tooltip
		anchorContent={<CopyToClipboard
			height={`15px`}
			width={`15px`}
			textToCopy={traceId || ""}
			showImage={false}
		/>}
		tooltipText={"Copy to Clipboard"}
		tooltipAltText={"Copied to Clipboard!"}
	/></div>
}
const errorContent = (message: string, traceId: string) => {
	return <div>
		{message}
		{traceIdDiv(traceId)}
	</div>
}
const getErrorType = (error: any): JSX.Element => {

	const unexpectedErrorMsg: string = `Unexpected error occurred, try again later.`;
	if (error.uncaught)
		return errorContent(unexpectedErrorMsg, error.traceId);

	const errorsMap: { [statusCode: number]: string} = {
		503: unexpectedErrorMsg
	};

	if (errorsMap[error.statusCode])
		return errorContent(errorsMap[error.statusCode], error.traceId);

	return errorContent(unexpectedErrorMsg, error.traceId);

}

const ErrorHandler = () => {

	const notifyError = (error: any) => {

		const notification = getErrorType(error);

		store.addNotification({
			title: "Oops...",
			message: notification,
			type: "danger",
			insert: "top",
			container: "top-right",
			animationIn: ["animate__animated", "animate__fadeIn"],
			animationOut: ["animate__animated", "animate__fadeOut"],
			dismiss: {
				showIcon: true,
				touch: true,
				duration: 0,
				click: false
			}
		});
	}

	return {
		notifyError
	} as const;
}

export default ErrorHandler;