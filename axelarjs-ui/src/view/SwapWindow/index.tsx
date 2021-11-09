import {ReactElement}                    from "react";
import {CSSTransition, SwitchTransition} from "react-transition-group";
import styled                            from "styled-components";
import {animateStyles}                   from "component/StyleComponents/animations/SwitchToggleAnimation";
import {GridDisplay}                     from "component/StyleComponents/GridDisplay";
import {StyledImage}                     from "component/StyleComponents/StyledImage";
import usePostTransactionToBridge        from "hooks/usePostTransactionToBridge";
import svg                               from "resources/transfer-modal-light-mode.svg";
import UserInputWindow                   from "./UserInputWindow";
import TransactionStatusWindow           from "./TransactionStatusWindow2";

const StyledSwapWindow = styled(GridDisplay)`
	max-width: 638px;
	min-width: 600px;
	min-height: 450px;
	max-height: 642px;
	width: 50%;
	box-sizing: border-box;
	position: absolute;
    top: 15%;
	${animateStyles}
`;

const StyledToggleContainer = styled.div`
	height: 100%;
	padding: 15%;
	z-index: 15;
	position: relative;
	min-height: 500px;
	display: flex;
	flex-direction: column;
	justify-content: space-between;
`;

const SwapWindow = (): ReactElement => {

	const [
		showTransactionStatusWindow,
		handleTransactionSubmission,
		closeResultsScreen
	] = usePostTransactionToBridge();

	const userInputNeeded = !showTransactionStatusWindow;

	return <StyledSwapWindow>
		<StyledImage src={svg}/>
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