import React, {cloneElement, useState} from "react";
import {Modal}                         from "react-bootstrap";
import Button                          from "react-bootstrap/Button";
import {SVGImage}                      from "component/Widgets/SVGImage";

interface IModalComponentProps {
	modaltext: string | undefined;
	items: JSX.Element;
}

function ModalWidget(props: IModalComponentProps) {

	const [show, setShow] = useState(false);
	const handleClose = () => setShow(false);
	const handleShow = () => setShow(true);

	return (<>

		<div>{props.modaltext || "You're using this modal but need text for the button trigger"}</div>

		<SVGImage
			onClick={handleShow}
			src={require(`assets/chevron-down-black.svg`)?.default}
			height={"8px"}
			width={"20px"}
		/>

		<Modal show={show} onHide={handleClose}>
			<Modal.Body>
				{cloneElement(props.items, {...props, onHide: handleClose})}
			</Modal.Body>
			<Modal.Footer>
				<Button variant="secondary" onClick={handleClose}>
					Close
				</Button>
			</Modal.Footer>
		</Modal>

	</>);
}

export default ModalWidget;