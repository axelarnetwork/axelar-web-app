/*
This component makes the API call to the SDK
* */

import {useCallback, useMemo}                              from "react";
import {useRecoilState, useRecoilValue, useSetRecoilState} from "recoil";
import {v4 as uuidv4}                                      from 'uuid';
import {
	AssetInfo, AssetInfoWithTrace, AssetTransferObject, ChainInfo
}                                                          from "@axelar-network/axelarjs-sdk";
import {TransferAssetBridgeFacade}                         from "api/TransferAssetBridgeFacade";
import {DESTINATION_TOKEN_KEY, SOURCE_TOKEN_KEY}           from "config/consts";
import {ChainSelection, DestinationAddress, SourceAsset}   from "state/ChainSelection";
import {
	IConfirmationStatus, NumberConfirmations, SourceDepositAddress, TransactionTraceId
}                                                          from "state/TransactionStatus";
import NotificationHandler                                 from "utils/NotificationHandler";
import {depositConfirmCbMap}                               from "./helper";
import {
	ShowTransactionStatusWindow
}                                                          from "../state/ApplicationStatus";
import {SendLogsToServer}                                  from "../api/SendLogsToServer";
import usePersonalSignAuthenticate                         from "./auth/usePersonalSignAuthenticate";

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
	const notificationHandler = NotificationHandler();
	const personalSignAuthenticate = usePersonalSignAuthenticate();

	const sCb: (status: any, setConfirms: any, traceId: string, source: boolean) => void = useCallback((status: any, setConfirms: any, traceId: string, source: boolean): void => {
		if (source && status?.timedOut) {
			notificationHandler.notifyError({
				statusCode: 408,
				message: "Timed out waiting for your deposit... we waited two hours!",
				traceId
			});
			return;
		}
		const confirms: IConfirmationStatus = {
			numberConfirmations: depositConfirmCbMap[sourceChain?.chainSymbol.toLowerCase() as string]
				? depositConfirmCbMap[sourceChain?.chainSymbol.toLowerCase() as string](status)
				: 1,
			numberRequiredConfirmations: status.axelarRequiredNumConfirmations,
			transactionHash: status?.transactionHash,
			amountConfirmedString: status?.Attributes?.amount
		};
		setConfirms(confirms);
	}, [sourceChain, notificationHandler]);

	const failCb = (data: any): void => console.log(data);

	const msg: AssetTransferObject = useMemo(() => ({
		sourceChainInfo: {...sourceChain, assets: undefined} as ChainInfo,
		selectedSourceAsset: sourceAsset as AssetInfo,
		destinationChainInfo: {...destinationChain, assets: undefined} as ChainInfo,
		selectedDestinationAsset: {
			assetAddress: destinationAddress,
			assetSymbol: sourceAsset?.assetSymbol, // the destination asset will be the wrapped asset of the source token
			common_key: sourceAsset?.common_key
		} as AssetInfo,
		signature: "",
		otc: "",
		publicAddr: "",
		transactionTraceId: ""
	}), [destinationAddress, destinationChain, sourceAsset, sourceChain]);

	const postRequest = useCallback(async (traceId: string, signature: string, otc: string, publicAddr: string) => {
		try {

			msg.signature = signature;
			msg.otc = otc;
			msg.publicAddr = publicAddr;

			const res: AssetInfoWithTrace = await TransferAssetBridgeFacade.transferAssets(
				msg,
				{successCb: (data: any) => sCb(data, setSourceNumConfirmations, traceId, true), failCb},
				{successCb: (data: any) => sCb(data, setDestinationNumConfirmations, traceId, false), failCb});
			setDepositAddress(res.assetInfo);
			return res;
		} catch (e: any) {
			e.traceId = traceId;
			SendLogsToServer.error("usePostTransactionToBridge_postRequest_1", msg + JSON.stringify(e), traceId);
			console.log("usePostTransactionToBridge_postRequest_1", e);
			if (e.statusCode === 504 || e.message === "AxelarJS-SDK uncaught post error") {
				e.statusCode = 504;
				notificationHandler.notifyInfo(e)
			} else {
				notificationHandler.notifyError(e);
			}
			setShowTransactionStatusWindow(false);
		}
	}, [notificationHandler, msg, sCb, setDepositAddress, setDestinationNumConfirmations, setSourceNumConfirmations, setShowTransactionStatusWindow]);

	const handleTransactionSubmission = useCallback(() => {

		let traceId: string = msg.transactionTraceId || uuidv4();
		setTransactionTraceId(traceId);
		msg.transactionTraceId = traceId;
		console.log("transaction trace id to use", msg.transactionTraceId);

		return new Promise(async (resolve, reject) => {

			if (!(sourceChain?.chainSymbol && destinationChain?.chainSymbol && destinationAddress && sourceAsset)) {
				reject("no input params");
				return;
			}

			try {
				setShowTransactionStatusWindow(true);
				const {authenticateWithMetamask} = personalSignAuthenticate;
				const { signature, otc, publicAddress } = await authenticateWithMetamask();
				const res = await postRequest(traceId, signature, otc, publicAddress);
				resolve(res);
			} catch (e: any) {
				setShowTransactionStatusWindow(false);
				SendLogsToServer.error("usePostTransactionToBridge_FRONTEND_ERROR_2", JSON.stringify(e), traceId);
				if (!e.traceId) {
					e.traceId = traceId
				}
				reject(e);
				throw new Error(e);
			}

		})
	}, [sourceChain, destinationChain, destinationAddress, setShowTransactionStatusWindow, setTransactionTraceId,
		sourceAsset, msg, postRequest, personalSignAuthenticate
	]);

	const closeResultsScreen = () => setShowTransactionStatusWindow(false);

	return [showTransactionStatusWindow as boolean,
		handleTransactionSubmission as () => Promise<string>,
		closeResultsScreen as () => void
	] as const;
}