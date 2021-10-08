import {cloneElement, useState} from "react";
import {Form, Modal}            from "react-bootstrap";
import Button                   from "react-bootstrap/Button";

interface IModalComponentProps {
	modaltext: string | undefined;
	items: JSX.Element;
}

function ModalWidget(props: IModalComponentProps) {
	const [show, setShow] = useState(false);

	const handleClose = () => setShow(false);
	const handleShow = () => setShow(true);

	return (
		<>
			<Form.Select bsPrefix={"form-select background-override"} aria-label="Default select example"
			             onClick={handleShow}>
				<option>{props.modaltext || "You're using this modal but need text for the button trigger"}</option>
			</Form.Select>

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
		</>
	);
}

export default ModalWidget;