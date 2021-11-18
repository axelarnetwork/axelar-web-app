import React, {useEffect, useState}                                          from "react";
import {useRecoilValue}                                                      from "recoil";
import {DESTINATION_TOKEN_KEY, SOURCE_TOKEN_KEY}                             from "config/consts";
import TransferFeeDivider
                                                                             from "component/CompositeComponents/TransferFeeDivider";
import {opacityAnimation}                                                    from "component/StyleComponents/animations/OpacityAnimation";
import {FlexRow}                                                             from "component/StyleComponents/FlexRow";
import useCartoonMessageDispatcher                                           from "hooks/useCartoonMessageDispatcher";
import useResetUserInputs                                                    from "hooks/useResetUserInputs";
import {IsRecaptchaAuthenticated, NumberConfirmations, SourceDepositAddress} from "state/TransactionStatus";
import {ChainSelection}                                                      from "state/ChainSelection";
import styled                                                                from "styled-components";
import Page1                                                                 from "./Pages/Page1";
import ButtonContainer                                                       from "../ButtonContainer";
import PlainButton                                                           from "../PlainButton";
import Page2                                                                 from "./Pages/Page2";
import {CSSTransition, SwitchTransition}                                     from "react-transition-group";
import Page3                                                                 from "./Pages/Page3";
import Page4                                                                 from "./Pages/Page4";

interface ITransactionStatusWindowProps {
	isOpen: boolean;
	closeResultsScreen: any;
}

const StyledTransactionStatusWindow = styled.div`
	${opacityAnimation}
	width: 300px;
	height: 435px;
    position: relative;
    overflow: hidden;
    margin-bottom: 5px;
`;

const TransactionStatusWindow = ({isOpen, closeResultsScreen}: ITransactionStatusWindowProps) => {

	const sourceConfirmStatus = useRecoilValue(NumberConfirmations(SOURCE_TOKEN_KEY));
	const destinationConfirmStatus = useRecoilValue(NumberConfirmations(DESTINATION_TOKEN_KEY));
	const destinationChain = useRecoilValue(ChainSelection(DESTINATION_TOKEN_KEY));
	const sourceChain = useRecoilValue(ChainSelection(SOURCE_TOKEN_KEY));
	const depositAddress = useRecoilValue(SourceDepositAddress);
	const isRecaptchaAuthenticated = useRecoilValue(IsRecaptchaAuthenticated);
	const setMessageInCartoon = useCartoonMessageDispatcher();
	const resetUserInputs = useResetUserInputs();
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

	const getActivePage = () => {
		let activePage: any;
		switch (true) {
			case (activeStep === 4):
				activePage = <Page4/>;
				break;
			case (activeStep === 3):
				activePage = <Page3/>;
				break;
			case (activeStep === 2):
				activePage = <Page2/>;
				break;
			default:
				activePage = <Page1/>;
		}
		return <SwitchTransition mode={"out-in"}>
			<CSSTransition
				key={`transaction-status-active-page-${activeStep}`}
				addEndListener={(node, done) => node.addEventListener("transitionend", done, false)}
				classNames="lighten"
			>{activePage}</CSSTransition>
		</SwitchTransition>
	}
	return <StyledTransactionStatusWindow>
		<FlexRow style={{color: `white`}}>{activeStep < 4 ? "Transferring" : "Complete!"}</FlexRow>
		<br/>
		<FlexRow><h5>{sourceChain?.chainName} {'>>>'} {destinationChain?.chainName}</h5></FlexRow>
		<br/>
		{isRecaptchaAuthenticated
			? getActivePage()
			: <FlexRow><br/>The transaction was not initiated.
				Some error occurred, potentially including a failed recaptcha authentication
			</FlexRow>
		}
		<br/>
		<TransferFeeDivider/>
		<ButtonContainer>{activeStep > 1 &&
        <PlainButton disabled={activeStep < 1} dim={activeStep < 1} onClick={() => {
			resetUserInputs();
			closeResultsScreen();
		}}>
            Go back
        </PlainButton>
		}</ButtonContainer>
	</StyledTransactionStatusWindow>;

}

export default TransactionStatusWindow;