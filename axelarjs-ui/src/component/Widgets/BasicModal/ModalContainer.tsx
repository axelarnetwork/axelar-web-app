import {useState} from "react";
import {SVGImage}        from "../SVGImage";
import './modal.css';

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

const ModalContainer = ({ children }: any) => {
	const [show, setShow] = useState(false);

	const showModal = () => setShow(true);
	const hideModal = () => setShow(false);

	console.log("show?",show);
	return (
		<div>
			<SVGImage
				onClick={showModal}
				src={require(`resources/chevron-down-black.svg`)?.default}
				height={"8px"}
				width={"20px"}
			/>
			<Modal show={show} handleClose={hideModal}>
				{children}
			</Modal>
		</div>
	);
}

export default ModalContainer;