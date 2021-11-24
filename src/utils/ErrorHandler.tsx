import { store }         from 'react-notifications-component';
import 'react-notifications-component/dist/theme.css';
import 'animate.css/animate.min.css';
import Tooltip           from "../component/Widgets/Tooltip";
import CopyToClipboard   from "../component/Widgets/CopyToClipboard";
import {getErrorMessage} from "../config/errorsMap";

const traceIdDiv = (traceId: string | undefined) => {
	if (!traceId)
		return null;
	return <div><br/>You can also let us know with this traceId: <Tooltip
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

	const unexpectedErrorMsg: string = getErrorMessage(503, error);

	if (error.uncaught)
		return errorContent(unexpectedErrorMsg, error.traceId);

	return errorContent(getErrorMessage(error.statusCode, error), error.traceId);

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