/*
This component makes the API call to the SDK
* */

import {useCallback}                                       from "react";
import {useRecoilState, useRecoilValue, useSetRecoilState} from "recoil";
import {v4 as uuidv4}                                      from 'uuid';
import {
	AssetInfoWithTrace, AssetTransferObject
}                                                          from "@axelar-network/axelarjs-sdk";
import {TransferAssetBridgeFacade}                         from "api/TransferAssetBridgeFacade";
import {DESTINATION_TOKEN_KEY, SOURCE_TOKEN_KEY}           from "config/consts";
import {ChainSelection, DestinationAddress, SourceAsset}   from "state/ChainSelection";
import {
	IConfirmationStatus, NumberConfirmations, SourceDepositAddress, TransactionTraceId
}                                                          from "state/TransactionStatus";
import ErrorHandler                                        from "utils/ErrorHandler";
import useRecaptchaAuthenticate                            from "./auth/useRecaptchaAuthenticate";
import {depositConfirmCbMap}                               from "./helper";
import {ShowTransactionStatusWindow}                       from "../state/ApplicationStatus";

export default function usePostTransactionToBridge() {

	const [showTransactionStatusWindow, setShowTransactionStatusWindow] = useRecoilState(ShowTransactionStatusWindow);
	const sourceChain = useRecoilValue(ChainSelection(SOURCE_TOKEN_KEY));
	const destinationChain = useRecoilValue(ChainSelection(DESTINATION_TOKEN_KEY));
	const destinationAddress = useRecoilValue(DestinationAddress);
	const setDepositAddress = useSetRecoilState(SourceDepositAddress);
	const setSourceNumConfirmations = useSetRecoilState(NumberConfirmations(SOURCE_TOKEN_KEY));
	const setDestinationNumConfirmations = useSetRecoilState(NumberConfirmations(DESTINATION_TOKEN_KEY));
	const setTransactionTraceId = useSetRecoilState(TransactionTraceId);
	const sourceAsset = useRecoilValue(SourceAsset);
	const [isRecaptchaAuthenticated, authenticateWithRecaptcha] = useRecaptchaAuthenticate();
	const errorHandler = ErrorHandler();

	const handleTransactionSubmission = useCallback(async () => new Promise((resolve, reject) => {

		const traceId: string = uuidv4();
		setTransactionTraceId(traceId);

		if (!(sourceChain?.chainSymbol && destinationChain?.chainSymbol && destinationAddress && sourceAsset)) {
			reject("no input params");
			return;
		}

		setShowTransactionStatusWindow(true);

		const sCb: (status: any, setConfirms: any) => void = (status: any, setConfirms: any): void => {
			const confirms: IConfirmationStatus = {
				numberConfirmations: depositConfirmCbMap[sourceChain.chainSymbol.toLowerCase()] ? depositConfirmCbMap[sourceChain.chainSymbol.toLowerCase()](status) : 1,
				numberRequiredConfirmations: status.axelarRequiredNumConfirmations,
				transactionHash: status?.transactionHash,
				amountConfirmedString: status?.Attributes?.amount
			};
			setConfirms(confirms);
		};

		const failCb = (data: any): void => console.log(data);

		const msg: AssetTransferObject = {
			sourceChainInfo: {...sourceChain, assets: undefined},
			selectedSourceAsset: sourceAsset,
			destinationChainInfo: {...destinationChain, assets: undefined},
			selectedDestinationAsset: {
				assetAddress: destinationAddress,
				assetSymbol: sourceAsset.assetSymbol, // the destination asset will be the wrapped asset of the source token
				common_key: sourceAsset.common_key
			},
			recaptchaToken: null,
			transactionTraceId: traceId
		}

		console.log("transaction trace id generated", msg.transactionTraceId);

		authenticateWithRecaptcha().then(async (token: any) => {
			if (isRecaptchaAuthenticated) {
				msg.recaptchaToken = token;
				try {
					const res: AssetInfoWithTrace = await TransferAssetBridgeFacade
					.transferAssets(msg,
						{successCb: (data: any) => sCb(data, setSourceNumConfirmations), failCb},
						{successCb: (data: any) => sCb(data, setDestinationNumConfirmations), failCb});
					setDepositAddress(res.assetInfo);
					resolve(res);
				} catch (e: any) {
					setShowTransactionStatusWindow(false);
					e.traceId = traceId;
					errorHandler.notifyError(e);
					reject("transfer bridge error" + e);
				}

			}
		})

	}), [
		sourceChain,
		destinationChain,
		destinationAddress,
		setDepositAddress,
		setSourceNumConfirmations,
		setDestinationNumConfirmations,
		setShowTransactionStatusWindow,
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