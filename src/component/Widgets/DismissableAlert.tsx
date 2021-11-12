import {Alert} from "react-bootstrap";
import Button  from "react-bootstrap/Button";

interface IDismissableAlertProps {
	headerText: string;
	bodyContent: JSX.Element;
	closeCb: () => void;
	open: boolean;
}

const DismissableAlert = (props: IDismissableAlertProps) => {
	const {bodyContent, closeCb, headerText, open} = props;

	return (<Alert show={open} variant="dark">
		<Alert.Heading>{headerText}</Alert.Heading>
		{bodyContent}
		<div className="d-flex justify-content-end">
			<Button onClick={() => closeCb()} variant="outline-success">
				Dismiss
			</Button>
		</div>
	</Alert>);
}

export default DismissableAlert;