import {store}           from 'react-notifications-component';
import BoldSpan          from "component/StyleComponents/BoldSpan";
import Tooltip           from "component/Widgets/Tooltip";
import CopyToClipboard   from "component/Widgets/CopyToClipboard";
import {getErrorMessage} from "config/errorsMap";
import 'react-notifications-component/dist/theme.css';
import 'animate.css/animate.min.css';

const traceIdDiv = (traceId: string | undefined) => {
	if (!traceId)
		return null;
	return <div><br/>For support, reach out on Discord with this <Tooltip
		anchorContent={<CopyToClipboard
			height={`15px`}
			JSXToShow={<div>traceId: <BoldSpan>{traceId}</BoldSpan></div>}
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
				duration: 15000,
				click: false
			}
		});
	}

	const notifyMessage = (message: string) => {

		store.addNotification({
			title: "Hmm...",
			message,
			type: "warning",
			insert: "top",
			container: "top-right",
			animationIn: ["animate__animated", "animate__fadeIn"],
			animationOut: ["animate__animated", "animate__fadeOut"],
			dismiss: {
				showIcon: true,
				touch: true,
				duration: 3000,
				click: false
			}
		});
	}

	return {
		notifyError,
		notifyMessage
	} as const;
}

export default ErrorHandler;