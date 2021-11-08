import {useEffect}                                                           from "react";
import {useRecoilValue}                                                      from "recoil";
import {DESTINATION_TOKEN_KEY, SOURCE_TOKEN_KEY}                             from "config/consts";
import {FlexRow}                                                             from "component/StyleComponents/FlexRow";
import {IsRecaptchaAuthenticated, NumberConfirmations, SourceDepositAddress} from "state/TransactionStatus";
import {ChainSelection, SourceAsset}                                         from "state/ChainSelection";
import useTodoList                                                           from "./useTodoList";

interface ITransactionStatusWindowProps {
	isOpen: boolean;
	closeResultsScreen: any;
}

const TransactionStatusWindow = ({isOpen, closeResultsScreen}: ITransactionStatusWindowProps) => {

	const [addStep, stepsJsx] = useTodoList();
	const sourceConfirmStatus = useRecoilValue(NumberConfirmations(SOURCE_TOKEN_KEY));
	const destinationConfirmStatus = useRecoilValue(NumberConfirmations(DESTINATION_TOKEN_KEY));
	const destinationChain = useRecoilValue(ChainSelection(DESTINATION_TOKEN_KEY));
	const sourceChain = useRecoilValue(ChainSelection(SOURCE_TOKEN_KEY));
	const depositAddress = useRecoilValue(SourceDepositAddress);
	const selectedSourceAsset = useRecoilValue(SourceAsset);
	const isRecaptchaAuthenticated = useRecoilValue(IsRecaptchaAuthenticated);

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
				addStep(`Transaction detected on ${destinationChain?.chainName}`, 3);
				break;
			case (depositAddress && sNumConfirms && sReqNumConfirms && sNumConfirms >= sReqNumConfirms):
				addStep(`Deposit confirmed. Axelar is working on your request`, 2);
				break;
			case !!depositAddress:
				addStep(`Please deposit/transfer ${selectedSourceAsset?.assetSymbol} 
					in ${sourceChain?.chainName} to the 
					following address: ${depositAddress?.assetAddress}`, 1);
				break;
			default:
				addStep(`Generating deposit address`, 0);
				break;
		}

	}, [destinationChain?.chainName,
		selectedSourceAsset?.assetSymbol, sourceChain?.chainName, dNumConfirms, dReqNumConfirms, depositAddress, sNumConfirms, sReqNumConfirms]);

	return <>
		<FlexRow><h4>Transaction Status</h4></FlexRow>
		{isRecaptchaAuthenticated
			? stepsJsx()
			: <FlexRow><br/>The transaction was not initiated.
				Some error occurred, potentially including a failed recaptcha authentication
			</FlexRow>
		}
	</>;

}

export default TransactionStatusWindow;