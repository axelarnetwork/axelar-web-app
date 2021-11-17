import {useEffect}                                                           from "react";
import {useRecoilValue}                                                      from "recoil";
import {DESTINATION_TOKEN_KEY, SOURCE_TOKEN_KEY}                             from "config/consts";
import TransferFeeDivider
                                                                             from "component/CompositeComponents/TransferFeeDivider";
import {FlexRow}                                                             from "component/StyleComponents/FlexRow";
import {StyledButton}                                                        from "component/StyleComponents/StyledButton";
import CopyToClipboard                                                       from "component/Widgets/CopyToClipboard";
import Tooltip                                                               from "component/Widgets/Tooltip";
import useCartoonMessageDispatcher                                           from "hooks/useCartoonMessageDispatcher";
import useResetUserInputs                                                    from "hooks/useResetUserInputs";
import {IsRecaptchaAuthenticated, NumberConfirmations, SourceDepositAddress} from "state/TransactionStatus";
import {ChainSelection, DestinationAddress, SourceAsset}                     from "state/ChainSelection";
import useTodoList                                                           from "./useTodoList";

interface ITransactionStatusWindowProps {
	isOpen: boolean;
	closeResultsScreen: any;
}

const TransactionStatusWindow = ({isOpen, closeResultsScreen}: ITransactionStatusWindowProps) => {

	const [activeStep, addStep, stepsJsx] = useTodoList();
	const sourceConfirmStatus = useRecoilValue(NumberConfirmations(SOURCE_TOKEN_KEY));
	const destAddr = useRecoilValue(DestinationAddress);
	const destinationConfirmStatus = useRecoilValue(NumberConfirmations(DESTINATION_TOKEN_KEY));
	const destinationChain = useRecoilValue(ChainSelection(DESTINATION_TOKEN_KEY));
	const sourceChain = useRecoilValue(ChainSelection(SOURCE_TOKEN_KEY));
	const depositAddress = useRecoilValue(SourceDepositAddress);
	const selectedSourceAsset = useRecoilValue(SourceAsset);
	const isRecaptchaAuthenticated = useRecoilValue(IsRecaptchaAuthenticated);
	const setMessageInCartoon = useCartoonMessageDispatcher();
	const resetUserInputs = useResetUserInputs();

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
				addStep(<div>Transaction detected in {destAddr} on the {destinationChain?.chainName} network</div>, 3);
				break;
			case (depositAddress && sNumConfirms && sReqNumConfirms && sNumConfirms >= sReqNumConfirms):
				addStep(<div>Deposit confirmed on our network. Axelar is working on your request</div>, 2);
				break;
			case !!depositAddress:
				const jsx = <>
					<div>Deposit {selectedSourceAsset?.assetSymbol} into {sourceChain?.chainName} here:</div>
					<div>
						{depositAddress?.assetAddress}
						<Tooltip
							tooltipText={<CopyToClipboard
								height={`12px`}
								width={`10px`}
								textToCopy={depositAddress?.assetAddress || ""}
							/>}
							tooltipBox={"Copy to Clipboard"}
						/>
					</div>
				</>;
				addStep(jsx, 1);
				setMessageInCartoon(`Once your deposit is confirmed, you can leave the rest to us... or following along with the rest if you would like!`);
				break;
			default:
				addStep(<div>Generating {selectedSourceAsset?.assetSymbol} deposit address</div>, 0);
				break;
		}
		// TODO: uncomment next line with fix above
		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, [destinationChain?.chainName,
		selectedSourceAsset?.assetSymbol, sourceChain?.chainName, dNumConfirms, dReqNumConfirms, depositAddress, sNumConfirms, sReqNumConfirms]);

	return <>
		<FlexRow><h5>Transaction Steps ({activeStep + 1}/4)</h5></FlexRow>
		<br/>
		{isRecaptchaAuthenticated
			? stepsJsx()
			: <FlexRow><br/>The transaction was not initiated.
				Some error occurred, potentially including a failed recaptcha authentication
			</FlexRow>
		}
		<br/>
		<div style={{bottom: `0`}}>
			{activeStep > 1 && <StyledButton style={{marginBottom: `5px`}} onClick={() => {
				resetUserInputs();
				closeResultsScreen();
			}}>Go back</StyledButton>}
			<TransferFeeDivider/>
		</div>
	</>;

}

export default TransactionStatusWindow;