import {ReactElement}                    from "react";
import {CSSTransition, SwitchTransition} from "react-transition-group";
import styled                            from "styled-components";
import svg                               from "assets/transfer-modal-light-mode.svg";
import {GridDisplay}                     from "component/StyleComponents/GridDisplay";
import {animateStyles}                   from "component/StyleComponents/SwitchToggleAnimation";
import usePostTransactionToBridge        from "hooks/usePostTransactionToBridge";
import UserInputWindow                   from "./UserInputWindow";
import TransactionStatusWindow           from "./TransactionStatusWindow";

const StyledSwapWindow = styled(GridDisplay)`
	background-image: url(${svg});
	background-repeat: no-repeat;
	background-size: cover;
	height: 480px;
	width: 483px;
	padding: 75px;
	box-sizing: border-box;
	${animateStyles}
`;

const StyledToggleContainer = styled.div`
	max-width: 600px;
	overflow: hidden;
	height: 100%;
`;

const SwapWindow = (): ReactElement => {

	const [
		showTransactionStatusWindow,
		handleTransactionSubmission,
		closeResultsScreen
	] = usePostTransactionToBridge();

	const userInputNeeded = !showTransactionStatusWindow;

	return <StyledSwapWindow>
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