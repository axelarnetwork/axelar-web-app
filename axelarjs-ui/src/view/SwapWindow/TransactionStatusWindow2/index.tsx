import {useEffect, useState}                               from "react";
import {useRecoilCallback, useRecoilState, useRecoilValue} from "recoil";
// import {Step, Stepper}                                                       from "react-form-stepper";
// import Button                                                                from "react-bootstrap/Button";
import {DESTINATION_TOKEN_KEY, SOURCE_TOKEN_KEY}                             from "config/consts";
// import BoldSpan                                                              from "component/StyleComponents/BoldSpan";
// import {FooterComponent}                                                     from "component/StyleComponents/FooterComponent";
import {FlexRow}                                                             from "component/StyleComponents/FlexRow";
// import useResetUserInputs                                                    from "hooks/useResetUserInputs";
import {IsRecaptchaAuthenticated, NumberConfirmations, SourceDepositAddress} from "state/TransactionStatus";
// import {ChainSelection, SourceAsset} from "state/ChainSelection";
import useTodoList                                                           from "./useTodoList";
import {Nullable}                                                            from "../../../interface/Nullable";
import {IAssetInfo}                                                          from "@axelar-network/axelarjs-sdk";

interface ITransactionStatusWindowProps {
	isOpen: boolean;
	closeResultsScreen: any;
}
const TransactionStatusWindow = ({isOpen, closeResultsScreen}: ITransactionStatusWindowProps) => {

	const [steps, addStep, stepsJsx] = useTodoList();
	const sourceConfirmStatus = useRecoilValue(NumberConfirmations(SOURCE_TOKEN_KEY));
	const destinationConfirmStatus = useRecoilValue(NumberConfirmations(DESTINATION_TOKEN_KEY));
	// const depositAddress = useRecoilValue(SourceDepositAddress);
	const [depositAddress, setDepositAddress] = useRecoilState(SourceDepositAddress);
	// const selectedSourceAsset = useRecoilValue(SourceAsset);
	// const resetUserInputs = useResetUserInputs();
	// const sourceChain = useRecoilValue(ChainSelection(SOURCE_TOKEN_KEY));
	// const destinationChain = useRecoilValue(ChainSelection(DESTINATION_TOKEN_KEY));
	const isRecaptchaAuthenticated = useRecoilValue(IsRecaptchaAuthenticated);
	const [activeStep, setActiveStep] = useState(0);

	const {numberConfirmations: sNumConfirms, numberRequiredConfirmations: sReqNumConfirms} = sourceConfirmStatus;
	const {
		numberConfirmations: dNumConfirms,
		numberRequiredConfirmations: dReqNumConfirms,
		// transactionHash
	} = destinationConfirmStatus;

	// const setActiveState = useRecoilCallback(({snapshot}) => async () => {
	// 	const destinationConfirmStatus = await snapshot.getPromise(NumberConfirmations(DESTINATION_TOKEN_KEY));
	// 	const {
	// 		numberConfirmations: dNumConfirms,
	// 		numberRequiredConfirmations: dReqNumConfirms,
	// 		// transactionHash
	// 	} = destinationConfirmStatus;
	// 	const depositAddress = await snapshot.getPromise(SourceDepositAddress);
	// 	console.log('destinationConfirmStatus: ', destinationConfirmStatus, depositAddress);
	// 	let activeStep: number;
	// 	switch (true) {
	// 		case !!(dNumConfirms && dReqNumConfirms):
	// 			activeStep = 4;
	// 			break;
	// 		case (depositAddress && sNumConfirms && sReqNumConfirms && sNumConfirms >= sReqNumConfirms):
	// 			activeStep = 3;
	// 			break;
	// 		case !!depositAddress:
	// 			activeStep = 2;
	// 			// addStep(`Please deposit ${depositAddress?.assetSymbol} into ${depositAddress?.assetAddress}`);
	// 			break;
	// 		default:
	// 			activeStep = 1;
	// 			// addStep(`Generating deposit address`);
	// 			break;
	// 	}
	// 	addStep(activeStep);
	// 	return activeStep;
	// });

	useEffect(() => {
		console.log("render transaction status screen");
		let activeStep: number;
		switch (true) {
			case !!(dNumConfirms && dReqNumConfirms):
				activeStep = 4;
				break;
			case (depositAddress && sNumConfirms && sReqNumConfirms && sNumConfirms >= sReqNumConfirms):
				activeStep = 3;
				break;
			case !!depositAddress:
				activeStep = 2;
				// addStep(`Please deposit ${depositAddress?.assetSymbol} into ${depositAddress?.assetAddress}`);
				break;
			default:
				activeStep = 1;
				// addStep(`Generating deposit address`);
				break;
		}
		// setActiveStep(activeStep);

	},[dNumConfirms, dReqNumConfirms, depositAddress, sNumConfirms, sReqNumConfirms]);

	// console.log("active step",activeStep);

	return <>
		<FlexRow><h4>Transaction Status</h4></FlexRow>
		{isRecaptchaAuthenticated
			? <div style={{ background: `blue`}} onClick={() => {
				console.log("CLICKED");
				setDepositAddress({ assetAddress: "ctt",assetSymbol: "canh"});
			}}>{stepsJsx()}</div>
			: <FlexRow><br/>The transaction was not initiated.
				Some error occurred, potentially including a failed recaptcha authentication
			</FlexRow>
		}
	</>;

}

export default TransactionStatusWindow;