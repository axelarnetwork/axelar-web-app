import {store}                  from 'react-notifications-component';
import BoldSpan                 from "component/StyleComponents/BoldSpan";
import Tooltip                  from "component/Widgets/Tooltip";
import CopyToClipboard          from "component/Widgets/CopyToClipboard";
import {getNotificationMessage} from "config/errorsMap";
import 'react-notifications-component/dist/theme.css';
import 'animate.css/animate.min.css';

const traceIdDiv = (traceId: string | undefined) => {
	if (!traceId)
		return null;
	return <div><br/>For support, reach out on Discord in the <BoldSpan>#satellite-ticketing-support</BoldSpan> channel
		with this <Tooltip
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
const MessageContent = (message: string, traceId: string) => {
	return <div>
		{message}
		{traceIdDiv(traceId)}
	</div>
}
const getMessageType = (error: any): JSX.Element => {
	console.log("erorrrrr",error);

	return MessageContent(getNotificationMessage(error.statusCode, error), error.statusCode !== 504 ? error.traceId : null);

}

const NotificationHandler = () => {

	const notifyError = (error: any) => {

		const notification = getMessageType(error);

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

	const notifyMessage = (message: any) => {

		const notification = getMessageType(message);

		store.addNotification({
			title: "Hmm...",
			message: notification,
			type: "warning",
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

	const notifyInfo = (message: any) => {

		const notification = getMessageType(message);

		store.addNotification({
			message: notification,
			type: "default",
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

	return {
		notifyError,
		notifyInfo,
		notifyMessage
	} as const;
}

export default NotificationHandler;