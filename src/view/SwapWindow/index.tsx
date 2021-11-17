import {ReactElement}                    from "react";
import {CSSTransition, SwitchTransition} from "react-transition-group";
import styled                            from "styled-components";
import screenConfigs                     from "config/screenConfigs";
import {animateStyles}                   from "component/StyleComponents/animations/SwitchToggleAnimation";
import usePostTransactionToBridge        from "hooks/usePostTransactionToBridge";
import svg                               from "resources/inactive-box.svg";
import UserInputWindow                   from "./UserInputWindow";
import TransactionStatusWindow           from "./TransactionStatusWindow";
import {StyledCentered}                  from "../../component/StyleComponents/Centered";

const StyledImage = styled.img`
	position: absolute;
	width: 1256px;
	height: 533px;
`;

const StyledSwapWindow = styled.div`
	// overflow: scroll;
	${StyledCentered}
	${animateStyles}
    // background-size: 100% 100%;
    // background-position: center center;
    // background-image: url(${svg});
    position: relative;
    width: 100%;
    height: 100%;
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

const StyledContainer = styled.div`
	// position: absolute;
    /* padding: 10% 18% 5% 18%; */
    /* top: 5%; */
    /* left: 0; */
    /* right: 0; */
    /* bottom: 0; */
    width: 350px;
    z-index: 10;
    height: 400px;
`;

const SwapWindow = (): ReactElement => {

	const [
		showTransactionStatusWindow,
		handleTransactionSubmission,
		closeResultsScreen
	] = usePostTransactionToBridge();

	const userInputNeeded = !showTransactionStatusWindow;

	return <StyledSwapWindow>
		<StyledImage src={svg} />
		<SwitchTransition mode={"out-in"}>
			<CSSTransition
				key={userInputNeeded ? "user-input-window" : "transaction-status-window"}
				addEndListener={(node, done) => node.addEventListener("transitionend", done, false)}
				classNames="fade"
			><StyledContainer>{ userInputNeeded
				? <UserInputWindow handleSwapSubmit={handleTransactionSubmission}/>
				: <TransactionStatusWindow isOpen={showTransactionStatusWindow}
				                           closeResultsScreen={closeResultsScreen}/>
			}</StyledContainer></CSSTransition>
		</SwitchTransition>
	</StyledSwapWindow>;

}

export default SwapWindow;