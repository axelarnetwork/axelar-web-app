import {ReactElement}                    from "react";
import {CSSTransition, SwitchTransition} from "react-transition-group";
import styled                            from "styled-components";
import screenConfigs                     from "config/screenConfigs";
import {animateStyles}                   from "component/StyleComponents/animations/SwitchToggleAnimation";
import usePostTransactionToBridge        from "hooks/usePostTransactionToBridge";
import svg                               from "resources/select-component.svg";
import UserInputWindow                   from "./UserInputWindow";
import TransactionStatusWindow           from "./TransactionStatusWindow";
import {StyledCentered}                  from "../../component/StyleComponents/Centered";

const StyledSwapWindow = styled.div`
	// overflow: scroll;
	${StyledCentered}
	${animateStyles}
    background-size: 100% 100%;
    background-position: center center;
    background-image: url(${svg});
    position: relative;
    width: 40%;
    padding-top: 45%;
    height: 0;
    position: relative;
    box-sizing: border-box;
    
	/*TODO: this is where the responsive breakpoint screens would be set*/
	@media ${screenConfigs.media.laptop} {
	}
	@media ${screenConfigs.media.tablet} {
	}
	@media ${screenConfigs.media.mobile} {
	}
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
			>{ userInputNeeded
				? <UserInputWindow handleSwapSubmit={handleTransactionSubmission}/>
				: <TransactionStatusWindow isOpen={showTransactionStatusWindow}
				                           closeResultsScreen={closeResultsScreen}/>
			}</CSSTransition>
		</SwitchTransition>
	</StyledSwapWindow>;

}

export default SwapWindow;