import {useCallback, useState}                                  from "react";
import {useRecoilValue, useResetRecoilState, useSetRecoilState} from "recoil";
import {
	IAssetInfoWithTrace,
	IAssetTransferObject
}                                                               from "@axelar-network/axelarjs-sdk";
import {TransferAssetBridgeFacade}                              from "api/TransferAssetBridgeFacade";
import {DESTINATION_TOKEN_KEY, SOURCE_TOKEN_KEY}                from "config/consts";
import {ChainSelection, DestinationAddress, SourceAsset}        from "state/ChainSelection";
import {
	IConfirmationStatus,
	NumberConfirmations,
	SourceDepositAddress,
	TransactionTraceId
}                                                               from "state/TransactionStatus";
import useRecaptchaAuthenticate                                 from "./auth/useRecaptchaAuthenticate";
import {depositConfirmCbMap}                                    from "./helper";
import {v4 as uuidv4}                                           from 'uuid';
import ErrorHandler                                             from "../utils/ErrorHandler";

export default function usePostTransactionToBridge() {

	const [showTransactionStatusWindow, setShowTransactionStatusWindow] = useState(false);
	const sourceChain = useRecoilValue(ChainSelection(SOURCE_TOKEN_KEY));
	const destinationChain = useRecoilValue(ChainSelection(DESTINATION_TOKEN_KEY));
	const destinationAddress = useRecoilValue(DestinationAddress);
	const setDepositAddress = useSetRecoilState(SourceDepositAddress);
	const setTransactionTraceId = useSetRecoilState(TransactionTraceId);
	const setSourceNumConfirmations = useSetRecoilState(NumberConfirmations(SOURCE_TOKEN_KEY));
	const setDestinationNumConfirmations = useSetRecoilState(NumberConfirmations(DESTINATION_TOKEN_KEY));
	const sourceAsset = useRecoilValue(SourceAsset);
	const [isRecaptchaAuthenticated, authenticateWithRecaptcha] = useRecaptchaAuthenticate();
	const errorHandler = ErrorHandler();
	const [transactionTraceId, resetTransactionTraceId] = [useRecoilValue(TransactionTraceId), useResetRecoilState(TransactionTraceId)];

	const handleTransactionSubmission = useCallback(async () => new Promise((resolve, reject) => {

		if (!(sourceChain?.chainSymbol && destinationChain?.chainSymbol && destinationAddress && sourceAsset)) {
			reject("no input params");
			return;
		}

		setShowTransactionStatusWindow(true);

		const sCb: (status: any, setConfirms: any) => void = (status: any, setConfirms: any): void => {
			const confirms: IConfirmationStatus = {
				numberConfirmations: depositConfirmCbMap[sourceChain.chainSymbol.toLowerCase()](status),
				numberRequiredConfirmations: status.axelarRequiredNumConfirmations,
				transactionHash: status?.transactionHash
			};
			setConfirms(confirms);
		};

		const failCb = (data: any): void => console.log(data);

		const msg: IAssetTransferObject = {
			sourceChainInfo: {...sourceChain, assets: undefined},
			selectedSourceAsset: sourceAsset,
			destinationChainInfo: {...destinationChain, assets: undefined},
			selectedDestinationAsset: {
				assetAddress: destinationAddress,
				assetSymbol: sourceAsset.assetSymbol, // the destination asset will be the wrapped asset of the source token
				common_key: sourceAsset.common_key
			},
			recaptchaToken: null,
			transactionTraceId: uuidv4()
		}

		console.log("transaction trace id generated", msg.transactionTraceId);

		authenticateWithRecaptcha().then(async (token: any) => {
			if (isRecaptchaAuthenticated) {
				transactionTraceId && resetTransactionTraceId(); // reset any transaction trace ID if one exists in state
				msg.recaptchaToken = token;
				try {
					const res: IAssetInfoWithTrace = await TransferAssetBridgeFacade
					.transferAssets(msg,
						{successCb: (data: any) => sCb(data, setSourceNumConfirmations), failCb},
						{successCb: (data: any) => sCb(data, setDestinationNumConfirmations), failCb});
					setDepositAddress(res.assetInfo);
					setTransactionTraceId(res.traceId);
					resolve(res);
				} catch (e: any) {
					setShowTransactionStatusWindow(false);
					e.traceId = msg.transactionTraceId as string;
					setTransactionTraceId(msg.transactionTraceId as string);
					errorHandler.notifyError(e);
					reject("transfer bridge error" + e);
				}

			}
		})

	}), [
		sourceChain,
		destinationChain,
		destinationAddress,
		resetTransactionTraceId,
		transactionTraceId,
		setDepositAddress,
		setSourceNumConfirmations,
		setDestinationNumConfirmations,
		setTransactionTraceId,
		sourceAsset,
		isRecaptchaAuthenticated,
		authenticateWithRecaptcha,
		errorHandler
	]);

	const closeResultsScreen = () => setShowTransactionStatusWindow(false);

	return [showTransactionStatusWindow as boolean,
		handleTransactionSubmission as () => Promise<string>,
		closeResultsScreen as () => void
	] as const;
}