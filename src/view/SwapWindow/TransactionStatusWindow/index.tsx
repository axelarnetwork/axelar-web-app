import React, {useEffect, useState}                                          from "react";
import {useRecoilValue}                                                      from "recoil";
import {DESTINATION_TOKEN_KEY, SOURCE_TOKEN_KEY}                             from "config/consts";
import screenConfigs                                                         from "config/screenConfigs";
import {StyledChainSelectionIconWidget}                                      from "component/CompositeComponents/Selectors/ChainSelector/StyleComponents/StyledChainSelectionIconWidget";
import {SelectedChainLogoAndText}                                            from "component/CompositeComponents/Selectors/ChainSelector/SelectedChainLogoAndText";
import {opacityAnimation}                                                    from "component/StyleComponents/animations/OpacityAnimation";
import {FlexRow}                                                             from "component/StyleComponents/FlexRow";
import useCartoonMessageDispatcher                                           from "hooks/useCartoonMessageDispatcher";
import useResetAllState                                                      from "hooks/useResetAllState";
import {IsRecaptchaAuthenticated, NumberConfirmations, SourceDepositAddress} from "state/TransactionStatus";
import {ChainSelection}                                                      from "state/ChainSelection";
import styled                                                                from "styled-components";
import StyledButtonContainer
                                                                             from "../StyledComponents/StyledButtonContainer";
import PlainButton                                                           from "../StyledComponents/PlainButton";
import StatusList                                                            from "./StatusList";

interface ITransactionStatusWindowProps {
	isOpen: boolean;
	closeResultsScreen: any;
}

const StyledTransactionStatusWindow = styled.div`
	${opacityAnimation}
    position: relative;
    overflow: hidden;
    margin-bottom: 5px;

	@media ${screenConfigs.media.desktop} {
		width: 100%;
	    height: 685px;
	    margin-bottom: 5px;
	}
	@media ${screenConfigs.media.laptop} {
		width: 100%;
	    height: 565px;
	    margin-bottom: 20px;
	}
	@media ${screenConfigs.media.tablet} {
		width: 310px;
		height: 435px;
		margin-bottom: 5px;
	}
	@media ${screenConfigs.media.mobile} {
		width: 310px;
		height: 435px;
		margin-bottom: 5px;
	}
	    
`;

const StyledFlexRow = styled(FlexRow)`
	padding: 10px;
	box-sizing: border-box;
	border-radius: 9px;
	box-shadow: inset 0 0 3px 1px rgba(0, 0, 0, 0.16);
	background-color: #fefefe;
`;

const TransactionStatusWindow = ({isOpen, closeResultsScreen}: ITransactionStatusWindowProps) => {

	const sourceConfirmStatus = useRecoilValue(NumberConfirmations(SOURCE_TOKEN_KEY));
	const destinationConfirmStatus = useRecoilValue(NumberConfirmations(DESTINATION_TOKEN_KEY));
	const destinationChain = useRecoilValue(ChainSelection(DESTINATION_TOKEN_KEY));
	const sourceChain = useRecoilValue(ChainSelection(SOURCE_TOKEN_KEY));
	const depositAddress = useRecoilValue(SourceDepositAddress);
	const isRecaptchaAuthenticated = useRecoilValue(IsRecaptchaAuthenticated);
	const setMessageInCartoon = useCartoonMessageDispatcher();
	const resetAllstate = useResetAllState();
	const [activeStep, setActiveStep] = useState(0);

	const {numberConfirmations: sNumConfirms, numberRequiredConfirmations: sReqNumConfirms} = sourceConfirmStatus;
	const {
		numberConfirmations: dNumConfirms,
		numberRequiredConfirmations: dReqNumConfirms,
	} = destinationConfirmStatus;

	useEffect(() => {
		//todo: need to improve this, the 'right' way of doing something like this is here: https://bugfender.com/blog/react-hooks-common-mistakes/
		console.log("render transaction status screen");
		switch (true) {
			case !!(dNumConfirms && dReqNumConfirms):
				setActiveStep(4);
				break;
			case (depositAddress && sNumConfirms && sReqNumConfirms && sNumConfirms >= sReqNumConfirms):
				setActiveStep(3);
				break;
			case !!depositAddress:
				setActiveStep(2);
				setMessageInCartoon(`Once your deposit is confirmed, you can leave the rest to us... or following along with the rest if you would like!`);
				break;
			default:
				setActiveStep(1);
				break;
		}
	}, [dNumConfirms, dReqNumConfirms, depositAddress, sNumConfirms, sReqNumConfirms, setMessageInCartoon]);

	const showButton: boolean = activeStep > 2;

	return <StyledTransactionStatusWindow>
		<FlexRow style={{color: `white`}}>{activeStep < 4 ? "Transferring" : "Complete!"}</FlexRow>
		<br/>
		<StyledFlexRow>
			<StyledChainSelectionIconWidget>
				<SelectedChainLogoAndText chainInfo={sourceChain}/>
			</StyledChainSelectionIconWidget>
			<img src={require(`resources/transaction_status_logos/transferring-icon.svg`)?.default} alt={""}/>
			<img src={require(`resources/transaction_status_logos/transferring-icon.svg`)?.default} alt={""}/>
			<StyledChainSelectionIconWidget style={{display: `flex`, justifyContent: `flex-end`}}>
				<SelectedChainLogoAndText chainInfo={destinationChain}/>
			</StyledChainSelectionIconWidget>
		</StyledFlexRow>
		{isRecaptchaAuthenticated
			? <StatusList activeStep={activeStep}/>
			: <FlexRow><br/>The transaction was not initiated.
				Some error occurred, potentially including a failed recaptcha authentication
			</FlexRow>
		}
		<br/>

		<StyledButtonContainer>{showButton &&
        <PlainButton disabled={!showButton} dim={!showButton} onClick={() => {
			resetAllstate();
			closeResultsScreen();
		}}>
            Start New Transaction
        </PlainButton>
		}</StyledButtonContainer>
	</StyledTransactionStatusWindow>;

}

export default TransactionStatusWindow;