import React, {ReactElement, useRef}                            from "react";
import {CSSTransition, SwitchTransition}                        from "react-transition-group";
import {useRecoilValue}                                         from "recoil";
import styled, {ThemedStyledProps}                              from "styled-components";
import screenConfigs                                            from "config/screenConfigs";
import {DESTINATION_TOKEN_KEY, SOURCE_TOKEN_KEY}                from "config/consts";
import {animateStyles}                                          from "component/StyleComponents/animations/SwitchToggleAnimation";
import {StyledCentered}                                         from "component/StyleComponents/Centered";
import usePostTransactionToBridge                               from "hooks/usePostTransactionToBridge";
import useRecaptchaAuthenticate                                 from "hooks/auth/useRecaptchaAuthenticate";
import {ShowRecaptchaV2Retry}                                   from "state/ApplicationStatus";
import {ChainSelection, IsValidDestinationAddress, SourceAsset} from "state/ChainSelection";
import inactiveBox                                              from "resources/inactive-box.svg";
import activeBox                                                from "resources/active-box.svg";
import UserInputWindow                                          from "./UserInputWindow";
import TransactionStatusWindow                                  from "./TransactionStatusWindow";
import FAQPage                                                  from "../FAQPage";
import ReCAPTCHA                                                from "react-google-recaptcha";
import downstreamServices                                       from "../../config/downstreamServices";

interface IStyledImageProps extends ThemedStyledProps<any, any> {
	showContents?: boolean;
}

const StyledImage = styled.img<IStyledImageProps>`
	position: absolute;
	opacity: ${props => props.showContents ? "1" : "0"};
	${props => props.showContents ? `transition: opacity 500ms ease-in;` : `transition: opacity 500ms ease-out; transition-delay: 500ms;`}

	@media ${screenConfigs.media.desktop} {
		width: 2048px;
		height: 869px;	
	}
	@media ${screenConfigs.media.laptop} {
		width: 1900px;
		height: 700px;	
	}
	@media ${screenConfigs.media.tablet} {
		width: 1256px;
		height: 533px;
	}
	@media ${screenConfigs.media.mobile} {
		width: 0px;
		height: 0px;
	}
	
`;

const StyledSwapWindow = styled.div`
	${StyledCentered}
	${animateStyles}
    position: relative;
    width: 100%;
    height: 100%;
    position: relative;
    box-sizing: border-box;
`;

const StyledContainer = styled.div`
	position: relative;
    z-index: 10;
    display: flex;
    align-items: center;
    justify-content: center;
    
	@media ${screenConfigs.media.desktop} {
		width: 510px;
	    height: 710px;
        display: flex;
	    align-items: flex-start;
	}
	@media ${screenConfigs.media.laptop} {
		width: 400px;
	    height: 650px;
	}
	@media ${screenConfigs.media.tablet} {
		width: 350px;
	    height: 533px;
	}
	@media ${screenConfigs.media.mobile} {
		width: 350px;
	    height: 533px;
	}
`;

const SwapWindow = (): ReactElement => {

	const recaptchaV2Ref = useRef(null);
	useRecaptchaAuthenticate(recaptchaV2Ref);
	const showRecaptchaV2Retry = useRecoilValue(ShowRecaptchaV2Retry);

	const [
		showTransactionStatusWindow,
		handleTransactionSubmission,
		closeResultsScreen
	] = usePostTransactionToBridge(recaptchaV2Ref);

	const userInputNeeded = !showTransactionStatusWindow;

	const sourceChainSelection = useRecoilValue(ChainSelection(SOURCE_TOKEN_KEY));
	const destChainSelection = useRecoilValue(ChainSelection(DESTINATION_TOKEN_KEY));
	const selectedSourceAsset = useRecoilValue(SourceAsset);
	const isValidDestinationAddr = useRecoilValue(IsValidDestinationAddress);

	const canLightUp = sourceChainSelection && destChainSelection
		&& sourceChainSelection.chainName !== destChainSelection.chainName
		&& selectedSourceAsset
		&& isValidDestinationAddr;

	const handleUserSubmit = async (attemptNumber: number) => {
		return await handleTransactionSubmission(attemptNumber);
	}

	return <StyledSwapWindow>

		<StyledImage src={activeBox} showContents={canLightUp}/>
		<StyledImage src={inactiveBox} showContents={!canLightUp}/>

		<SwitchTransition mode={"out-in"}>
			<CSSTransition
				key={userInputNeeded ? "user-input-window" : "transaction-status-window"}
				addEndListener={(node, done) => node.addEventListener("transitionend", done, false)}
				classNames="fade"
			><StyledContainer>
				{userInputNeeded
					? <UserInputWindow handleTransactionSubmission={handleUserSubmit}/>
					: <TransactionStatusWindow isOpen={showTransactionStatusWindow}
					                           closeResultsScreen={closeResultsScreen}/>
				}</StyledContainer></CSSTransition>
		</SwitchTransition>
		<FAQPage/>
		<div
			style={{
				zIndex: 10000, position: `absolute`, right: `15%`, bottom: `70px`,
				visibility: showRecaptchaV2Retry ? "inherit" : "hidden",
				boxShadow: `0 5px 10px 0 darkred`
			}}>
            <ReCAPTCHA
                ref={recaptchaV2Ref}
                sitekey={downstreamServices.RECAPTCHA_V2_SITE_KEY}
                size={"compact"}
                onChange={() => handleUserSubmit(2)}
            />
        </div>
	</StyledSwapWindow>;

}

export default SwapWindow;