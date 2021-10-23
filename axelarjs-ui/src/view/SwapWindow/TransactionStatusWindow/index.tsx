import React, {useEffect, useState}                                          from "react";
import {useRecoilValue}                                                      from "recoil";
import {Step, Stepper}                                                       from "react-form-stepper";
import Button                                                                from "react-bootstrap/Button";
import {DESTINATION_TOKEN_KEY, SOURCE_TOKEN_KEY}                             from "config/consts";
import BoldSpan                                                              from "component/StyleComponents/BoldSpan";
import {GridDisplay}                                                         from "component/StyleComponents/GridDisplay";
import {FooterComponent}                                                     from "component/StyleComponents/FooterComponent";
import {FlexRow}                                                             from "component/StyleComponents/FlexRow";
import useResetUserInputs                                                    from "hooks/useResetUserInputs";
import {IsRecaptchaAuthenticated, NumberConfirmations, SourceDepositAddress} from "state/TransactionStatus";
import {ChainSelection}                                                      from "state/ChainSelection";

interface ITransactionStatusWindowProps {
	isOpen: boolean;
	closeResultsScreen: any;
}

const TransactionStatusWindow = ({isOpen, closeResultsScreen}: ITransactionStatusWindowProps) => {

	const sourceConfirmStatus = useRecoilValue(NumberConfirmations(SOURCE_TOKEN_KEY));
	const destinationConfirmStatus = useRecoilValue(NumberConfirmations(DESTINATION_TOKEN_KEY));
	const depositAddress = useRecoilValue(SourceDepositAddress);
	const resetUserInputs = useResetUserInputs();
	const sourceChain = useRecoilValue(ChainSelection(SOURCE_TOKEN_KEY));
	const destinationChain = useRecoilValue(ChainSelection(DESTINATION_TOKEN_KEY));
	const [activeStep, setActiveStep] = useState<number>(0);
	const isRecaptchaAuthenticated = useRecoilValue(IsRecaptchaAuthenticated);

	const {numberConfirmations: sNumConfirms, numberRequiredConfirmations: sReqNumConfirms} = sourceConfirmStatus;
	const {numberConfirmations: dNumConfirms, numberRequiredConfirmations: dReqNumConfirms, transactionHash} = destinationConfirmStatus;

	useEffect(() => {
		//TODO: clean this up
		console.log("number of source confirmations", sNumConfirms, sReqNumConfirms, dNumConfirms, dReqNumConfirms);
		let activeStep: number;

		switch (true) {
			case !!(dNumConfirms && dReqNumConfirms):
				activeStep = 3; break;
			case (depositAddress && sNumConfirms && sReqNumConfirms && sNumConfirms >= sReqNumConfirms):
				activeStep = 2; break;
			case !!depositAddress:
				activeStep = 1; break;
			default:
				activeStep = 0;
		}
		setActiveStep(activeStep);

	}, [depositAddress, dNumConfirms, dReqNumConfirms, sNumConfirms, sReqNumConfirms]);

	const generateStatusBody = (activeStep: number) => {
		const dict: any = {};
		dict[0] = null;
		dict[1] = <div>
			{!sNumConfirms
				? <div>
					<div>
						Next step: please deposit
						<BoldSpan> {depositAddress?.assetSymbol} </BoldSpan>
						to the following address:
					</div>
					<br/>
					<div><BoldSpan> {depositAddress?.assetAddress}</BoldSpan></div>
				</div>
				: <div><p>Your transaction has been detected on the {sourceChain?.chainName} blockchain.
					If you wish to follow along, sit back; this may take a while.</p>
					<p>Currently detected {sNumConfirms} of {sReqNumConfirms} confirmations.</p>
					<p>Alternatively, you can just trust the process and wait for
						the {destinationChain?.chainName} tokens to
						hit your deposit account.</p>
				</div>
			}
		</div>;
		dict[2] = "Deposit Confirmed. Axelar Network is actively working on your request...";
		dict[3] = <div><p>Your transaction has been detected on the {destinationChain?.chainName} blockchain, so
			you're done as far as Axelar is concerned. Feel free to view the transaction status directly on that chain:
			<BoldSpan>{transactionHash}</BoldSpan>
		</p>
		</div>;
		return dict[activeStep];
	}

	/*
	progress bar that tracks four steps:
	1 - awaiting generation of deposit address for source chain
	2 - waiting for confirmations of deposit
	3 - waiting for first confirmation to show up on destination chain
	4 - waiting for requisite number of confirmations of destination chain
	* */
	const steps: string[] = [
		"Generating Source Chain Deposit Address",
		"Waiting on Source Chain Confirmations",
		"Axelar Network working...",
		"Waiting on Destination Chain Confirmations"
	];
	return <GridDisplay>
		<FlexRow><h4>Transaction Status</h4></FlexRow>
		{isRecaptchaAuthenticated
			? <><Stepper activeStep={activeStep}>
				{steps.map((stepDescription, idx) => <Step
					key={stepDescription}
					label={activeStep >= idx ? stepDescription : ""}
				/>)}
			</Stepper>
				{generateStatusBody(activeStep)}
				{activeStep >= 1 &&
                <FooterComponent>
                    <Button variant="secondary" onClick={() => {
						resetUserInputs();
						closeResultsScreen();
					}}>Dismiss updates & trust the process</Button>
                </FooterComponent>
				}</>
			: <FlexRow><br/>The transaction was not initiated.
				Some error occurred, potentially including a failed recaptcha authentication
			</FlexRow>
		}
	</GridDisplay>
}

export default TransactionStatusWindow;