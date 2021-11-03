import React, {cloneElement, useState} from "react";
import {Modal}                         from "react-bootstrap";
import Button                          from "react-bootstrap/Button";
import {SVGImage}                      from "component/Widgets/SVGImage";
import styled                          from "styled-components";

interface IModalComponentProps {
	modaltext: string | undefined;
	items: JSX.Element;
}

const ModalBodyStylesOverride = styled(Modal.Body)`
	background-color: unset !important;
`;

function ModalWidget(props: IModalComponentProps) {

	const [show, setShow] = useState(false);
	const handleClose = () => setShow(false);
	const handleShow = () => setShow(true);

	return (<>

		<SVGImage
			onClick={handleShow}
			src={require(`resources/chevron-down-black.svg`)?.default}
			height={"8px"}
			width={"20px"}
		/>

		<Modal show={show} onHide={handleClose} contentClassName={"custom-modal-style"}>
			<Modal.Body>
				{cloneElement(props.items, {...props, onHide: handleClose})}
			</Modal.Body>
			{/*<Modal.Footer>*/}
			{/*	<Button variant="secondary" onClick={handleClose}>*/}
			{/*		Close*/}
			{/*	</Button>*/}
			{/*</Modal.Footer>*/}
		</Modal>

	</>);
}

export default ModalWidget;