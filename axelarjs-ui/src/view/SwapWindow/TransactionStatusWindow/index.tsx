import React, {useEffect, useState}                              from "react";
import {useRecoilValue}                                          from "recoil";
import BoldSpan                                                  from "component/StyleComponents/BoldSpan";
import {GridDisplay}                                             from "component/StyleComponents/GridDisplay";
import {NumberConfirmations, SourceDepositAddress}               from "state/TransactionStatus";
import useResetUserInputs                                        from "hooks/useResetUserInputs";
import {Step, Stepper}                                           from "react-form-stepper";
import {FlexRow}                                                 from "../../../component/StyleComponents/FlexRow";
import {ChainSelection, DESTINATION_TOKEN_KEY, SOURCE_TOKEN_KEY} from "../../../state/ChainSelection";
import Button                                                    from "react-bootstrap/Button";
import {FooterComponent}                                         from "../../../component/StyleComponents/FooterComponent";

interface ITransactionStatusWindowProps {
	isOpen: boolean;
	closeResultsScreen: any;
}

const TransactionStatusWindow = ({isOpen, closeResultsScreen}: ITransactionStatusWindowProps) => {

	const confirmationStatus = useRecoilValue(NumberConfirmations);
	const depositAddress = useRecoilValue(SourceDepositAddress);
	const resetUserInputs = useResetUserInputs();
	const sourceChain = useRecoilValue(ChainSelection(SOURCE_TOKEN_KEY));
	const destinationChain = useRecoilValue(ChainSelection(DESTINATION_TOKEN_KEY));
	const [activeStep, setActiveStep] = useState(0);

	const {numberConfirmations, numberRequiredConfirmations} = confirmationStatus;

	useEffect(() => {
		//TODO: clean this up
		if (depositAddress && numberConfirmations && numberRequiredConfirmations && numberConfirmations > numberRequiredConfirmations) {
			setActiveStep(2);
		} else if (depositAddress) {
			setActiveStep(1);
		}
	}, [depositAddress, numberConfirmations, numberRequiredConfirmations]);

	const generateStatusBody = (activeStep: number) => {
		const {numberConfirmations, numberRequiredConfirmations} = confirmationStatus;
		const dict: any = {};
		dict[0] = null;
		dict[1] = <div>
			{!numberConfirmations
				? <div>
					<div>
						Next step: please deposit
						<BoldSpan> {depositAddress?.tokenSymbol} </BoldSpan>
						to the following address:
					</div>
					<br/>
					<div><BoldSpan> {depositAddress?.tokenAddress}</BoldSpan></div>
				</div>
				: <div><p>Your transaction has been detected on the {sourceChain?.name} blockchain.
					If you wish to follow along, sit back; this may take a while.</p>
					<p>Currently detected {numberConfirmations} of {numberRequiredConfirmations} confirmations.</p>
					<p>Alternatively, you can just trust the process and wait for the {destinationChain?.name} tokens to
						hit your deposit account.</p>
				</div>
			}
		</div>;
		dict[2] = "Axelar Network is actively working on your request...";
		dict[3] = "(TBD) Confirming ethereum transactions...";
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
		}
	</GridDisplay>
}


export default TransactionStatusWindow;