import {ReactElement}                                    from "react";
import {CSSTransition, SwitchTransition}                 from "react-transition-group";
import {useRecoilValue}                                  from "recoil";
import styled, {ThemedStyledProps}                       from "styled-components";
import screenConfigs                                     from "config/screenConfigs";
import {DESTINATION_TOKEN_KEY, SOURCE_TOKEN_KEY}         from "config/consts";
import {animateStyles}                                   from "component/StyleComponents/animations/SwitchToggleAnimation";
import {StyledCentered}                                  from "component/StyleComponents/Centered";
import usePostTransactionToBridge                        from "hooks/usePostTransactionToBridge";
import {ChainSelection, DestinationAddress, SourceAsset} from "state/ChainSelection";
import inactiveBox                                       from "resources/inactive-box.svg";
import activeBox                                         from "resources/active-box.svg";
import UserInputWindow                                   from "./UserInputWindow";
import TransactionStatusWindow                           from "./TransactionStatusWindow";

interface IStyledImageProps extends ThemedStyledProps<any, any> {
	showContents?: boolean;
}

const StyledImage = styled.img<IStyledImageProps>`
	position: absolute;
	width: 1256px;
	height: 533px;
	opacity: ${props => props.showContents ? "1" : "0"};
	${props => props.showContents ? `transition: opacity 500ms ease-in;` : `transition: opacity 500ms ease-out; transition-delay: 500ms;`}
`;

const StyledSwapWindow = styled.div`
	${StyledCentered}
	${animateStyles}
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
	width: 350px;
    z-index: 10;
    height: 533px;
    display: flex;
    align-items: center;
    justify-content: center;
`;

const SwapWindow = (): ReactElement => {

	const [
		showTransactionStatusWindow,
		handleTransactionSubmission,
		closeResultsScreen
	] = usePostTransactionToBridge();

	const userInputNeeded = !showTransactionStatusWindow;

	const sourceChainSelection = useRecoilValue(ChainSelection(SOURCE_TOKEN_KEY));
	const destChainSelection = useRecoilValue(ChainSelection(DESTINATION_TOKEN_KEY));
	const selectedSourceAsset = useRecoilValue(SourceAsset);
	const destAddr = useRecoilValue(DestinationAddress);

	const canLightUp = sourceChainSelection && destChainSelection
		&& sourceChainSelection.chainName !== destChainSelection.chainName
		&& selectedSourceAsset
		&& destAddr;

	return <StyledSwapWindow>

		<StyledImage src={activeBox} showContents={canLightUp}/>
		<StyledImage src={inactiveBox} showContents={!canLightUp}/>

		<SwitchTransition mode={"out-in"}>
			<CSSTransition
				key={userInputNeeded ? "user-input-window" : "transaction-status-window"}
				addEndListener={(node, done) => node.addEventListener("transitionend", done, false)}
				classNames="fade"
			><StyledContainer>{userInputNeeded
				? <UserInputWindow handleSwapSubmit={handleTransactionSubmission}/>
				: <TransactionStatusWindow isOpen={showTransactionStatusWindow}
				                           closeResultsScreen={closeResultsScreen}/>
			}</StyledContainer></CSSTransition>
		</SwitchTransition>
	</StyledSwapWindow>;

}

export default SwapWindow;