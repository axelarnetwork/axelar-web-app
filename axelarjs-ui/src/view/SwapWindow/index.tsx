import {ReactElement}                    from "react";
import {CSSTransition, SwitchTransition} from "react-transition-group";
import styled                            from "styled-components";
import svg                               from "resources/transfer-modal-light-mode.svg";
import {GridDisplay}                     from "component/StyleComponents/GridDisplay";
import {animateStyles}                   from "component/StyleComponents/SwitchToggleAnimation";
import usePostTransactionToBridge        from "hooks/usePostTransactionToBridge";
import UserInputWindow                   from "./UserInputWindow";
import TransactionStatusWindow           from "./TransactionStatusWindow";

const StyledSwapWindow = styled(GridDisplay)`
	// background-image: url(${svg});
	// background-repeat: no-repeat;
	// background-size: contain;
	// height: 100%;
	max-width: 638px;
	min-height: 450px;
	max-height: 642px;
	width: 50%;
	// padding: 75px 75px 50px 75px;
	box-sizing: border-box;
	position: absolute;
    top: 50px;
	${animateStyles}
`;

const StyledToggleContainer = styled.div`
	// max-width: 600px;
	// overflow: hidden;
	height: 100%;
	padding: 15%;
	z-index: 15;
`;

const StyledImage = styled.img`
	position: absolute;
	width: 100%;
	height: auto;
`;

const SwapWindow = (): ReactElement => {

	const [
		showTransactionStatusWindow,
		handleTransactionSubmission,
		closeResultsScreen
	] = usePostTransactionToBridge();

	const userInputNeeded = !showTransactionStatusWindow;

	return <StyledSwapWindow>
		{/*<div style={{ position: `absolute`, width: `100%`}}>*/}
			<StyledImage src={svg} />
		{/*</div>*/}
		<SwitchTransition mode={"out-in"}>
			<CSSTransition
				key={userInputNeeded ? "user-input-window" : "transaction-status-window"}
				addEndListener={(node, done) => node.addEventListener("transitionend", done, false)}
				classNames="fade"
			>
				<StyledToggleContainer>{userInputNeeded
					? <UserInputWindow handleSwapSubmit={handleTransactionSubmission}/>
					: <TransactionStatusWindow isOpen={showTransactionStatusWindow}
					                           closeResultsScreen={closeResultsScreen}/>
				}</StyledToggleContainer>
			</CSSTransition>
		</SwitchTransition>
	</StyledSwapWindow>;

}

export default SwapWindow;