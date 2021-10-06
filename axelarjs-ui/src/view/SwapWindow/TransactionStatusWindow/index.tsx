import React, {useEffect, useState}                from "react";
import {useRecoilValue}                            from "recoil";
import BoldSpan                                    from "component/StyleComponents/BoldSpan";
import {GridDisplay}                               from "component/StyleComponents/GridDisplay";
import {NumberConfirmations, SourceDepositAddress} from "state/TransactionStatus";
import useResetUserInputs                          from "hooks/useResetUserInputs";
import {Step, Stepper}                             from "react-form-stepper";
import {FlexRow}                          from "../../../component/StyleComponents/FlexRow";
import {ChainSelection, SOURCE_TOKEN_KEY} from "../../../state/ChainSelection";

interface ITransactionStatusWindowProps {
	isOpen: boolean;
	closeResultsScreen: any;
}
const TransactionStatusWindow = ({isOpen, closeResultsScreen}: ITransactionStatusWindowProps) => {

	const confirmationStatus = useRecoilValue(NumberConfirmations);
	const depositAddress = useRecoilValue(SourceDepositAddress);
	const resetUserInputs = useResetUserInputs();
	const sourceChain = useRecoilValue(ChainSelection(SOURCE_TOKEN_KEY));
	const [activeStep, setActiveStep] = useState(0);

	const { numberConfirmations, numberRequiredConfirmations } = confirmationStatus;

	useEffect(() => {
		//TODO: clean this up
		if (depositAddress && numberConfirmations && numberRequiredConfirmations && numberConfirmations > numberRequiredConfirmations) {
			setActiveStep(2);
		}
		else if(depositAddress){
			setActiveStep(1);
		}
	}, [depositAddress, numberConfirmations, numberRequiredConfirmations]);

	const generateStatusBody = (activeStep: number) => {
		const { numberConfirmations, numberRequiredConfirmations } = confirmationStatus;
		const dict: any = {};
		dict[0] = null;
		dict[1] = <div>
			{ !numberConfirmations
				? <div>
					<div>
		                Next step: please deposit
		                <BoldSpan> {depositAddress?.sourceTokenSymbol} </BoldSpan>
		                to the following address:
		            </div>
					<br />
					<div><BoldSpan> {depositAddress?.sourceTokenDepositAddress}</BoldSpan></div>
				</div>
				: <div> Your transaction has been detected on the {sourceChain?.name} blockchain.
					Currently detected {numberConfirmations} of {numberRequiredConfirmations} confirmations.
					Sit back; this may take a while.
				</div>
			}
		</div>;
		dict[2] = "Actively working...";
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
		<Stepper activeStep={activeStep}>
			{steps.map(stepDescription => <Step key={stepDescription} label={stepDescription} />)}
		</Stepper>
		{ generateStatusBody(activeStep) }
	</GridDisplay>
}



export default TransactionStatusWindow;