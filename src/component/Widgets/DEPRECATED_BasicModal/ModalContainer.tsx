import {cloneElement, useState} from "react";
import {SVGImage}               from "../SVGImage";
import styled                   from "styled-components";
import './modal.css';

const Modal = ({handleClose, show, children}: any) => {
	const showHideClassName = show ? "modal showing" : "modal not-showing";

	const onClick = (e: any) => {
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
interface IModalContainerProps {
	triggerText?: string;
	children?: any;
}
const ModalContainer = (props: IModalContainerProps) => {
	const [show, setShow] = useState(false);

	const showModal = () => setShow(true);
	const hideModal = () => setShow(false);

	return (
		<div>
			{ props.triggerText
				? <div onClick={showModal} style={{ cursor: `pointer` }}>{props.triggerText}</div>
				: <StyledSVGImage
					onClick={showModal}
					src={require(`resources/chevron-down-black.svg`)?.default}
					height={"8px"}
					width={"20px"}
				/>}
			<Modal show={show} handleClose={hideModal}>
				{cloneElement(props.children, {...props, handleClose: hideModal})}
			</Modal>
		</div>
	);
}

export default ModalContainer;