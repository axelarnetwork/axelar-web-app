import {cloneElement, useState} from "react";
import {SVGImage}               from "../SVGImage";
import './modal.css';
import styled                   from "styled-components";

const Modal = ({ handleClose, show, children }: any) => {
	const showHideClassName = show ? "modal showing" : "modal not-showing";

	const onClick = (e:any) => {
		e.preventDefault();
		if (e.target === e.currentTarget)
			handleClose();
	}

	return (
		<div className={showHideClassName} onClick={onClick}>
			<section className="modal-main">
				{children}
			</section>
		</div>
	);
};

const StyledSVGImage = styled(SVGImage)`
	cursor: pointer;
`;
const ModalContainer = (props: any) => {
	const [show, setShow] = useState(false);

	const showModal = () => setShow(true);
	const hideModal = () => setShow(false);

	return (
		<div>
			<StyledSVGImage
				onClick={showModal}
				src={require(`resources/chevron-down-black.svg`)?.default}
				height={"8px"}
				width={"20px"}
			/>
			<Modal show={show} handleClose={hideModal}>
				{cloneElement(props.children, {...props, handleClose: hideModal })}
			</Modal>
		</div>
	);
}

export default ModalContainer;