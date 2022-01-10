/*
This component makes the API call to the SDK
* */

import {useCallback, useMemo}                              from "react";
import {useRecoilState, useRecoilValue, useSetRecoilState} from "recoil";
import {v4 as uuidv4}                                      from 'uuid';
import { AssetInfo, AssetInfoWithTrace, AssetTransferObject, ChainInfo
} from "@axelar-network/axelarjs-sdk";
import {TransferAssetBridgeFacade}                         from "api/TransferAssetBridgeFacade";
import {DESTINATION_TOKEN_KEY, SOURCE_TOKEN_KEY}           from "config/consts";
import {ChainSelection, DestinationAddress, SourceAsset}   from "state/ChainSelection";
import {IConfirmationStatus, NumberConfirmations, SourceDepositAddress, TransactionTraceId
}                               from "state/TransactionStatus";
import NotificationHandler      from "utils/NotificationHandler";
import useRecaptchaAuthenticate from "./auth/useRecaptchaAuthenticate";
import {depositConfirmCbMap}                               from "./helper";
import {ShowRecaptchaV2Retry, ShowTransactionStatusWindow} from "../state/ApplicationStatus";

export default function usePostTransactionToBridge(recaptchaV2Ref: any) {

	const [showTransactionStatusWindow, setShowTransactionStatusWindow] = useRecoilState(ShowTransactionStatusWindow);
	const setShowRecaptchaV2Retry = useSetRecoilState(ShowRecaptchaV2Retry);
	const sourceChain = useRecoilValue(ChainSelection(SOURCE_TOKEN_KEY));
	const destinationChain = useRecoilValue(ChainSelection(DESTINATION_TOKEN_KEY));
	const destinationAddress = useRecoilValue(DestinationAddress);
	const setDepositAddress = useSetRecoilState(SourceDepositAddress);
	const setSourceNumConfirmations = useSetRecoilState(NumberConfirmations(SOURCE_TOKEN_KEY));
	const setDestinationNumConfirmations = useSetRecoilState(NumberConfirmations(DESTINATION_TOKEN_KEY));
	const setTransactionTraceId = useSetRecoilState(TransactionTraceId);
	const sourceAsset = useRecoilValue(SourceAsset);
	const {authenticateWithRecaptchaV3, authenticateWithRecaptchaV2} = useRecaptchaAuthenticate(recaptchaV2Ref);
	const notificationHandler = NotificationHandler();

	const sCb: (status: any, setConfirms: any) => void = useCallback((status: any, setConfirms: any): void => {
		const confirms: IConfirmationStatus = {
			numberConfirmations: depositConfirmCbMap[sourceChain?.chainSymbol.toLowerCase() as string]
				? depositConfirmCbMap[sourceChain?.chainSymbol.toLowerCase() as string](status)
				: 1,
			numberRequiredConfirmations: status.axelarRequiredNumConfirmations,
			transactionHash: status?.transactionHash,
			amountConfirmedString: status?.Attributes?.amount
		};
		setConfirms(confirms);
	}, [sourceChain]);

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
		recaptchaToken: null,
		recaptchaVersion: "v3",
		transactionTraceId: ""
	}),[destinationAddress, destinationChain, sourceAsset, sourceChain]);

	const postRequest = useCallback(async (traceId: string, recaptchaToken: string, attemptNumber: number, useLegacyRecaptcha: boolean) => {
		try {

			msg.recaptchaToken = recaptchaToken;
			msg.useLegacyRecaptcha = useLegacyRecaptcha;

			const res: AssetInfoWithTrace = await TransferAssetBridgeFacade.transferAssets(
				msg,
				{successCb: (data: any) => sCb(data, setSourceNumConfirmations), failCb},
				{successCb: (data: any) => sCb(data, setDestinationNumConfirmations), failCb});
			setDepositAddress(res.assetInfo);
			return res;
		} catch (e: any) {
			if (attemptNumber > 1) {
				setShowTransactionStatusWindow(false);
				e.traceId = traceId;
				notificationHandler.notifyError(e);
			}
			throw e;
		}
	}, [notificationHandler, msg, sCb, setDepositAddress, setDestinationNumConfirmations, setShowTransactionStatusWindow, setSourceNumConfirmations]);

	const handleTransactionSubmission = useCallback( (attemptNumber: number) => {

		let traceId: string = msg.transactionTraceId || uuidv4();
		if (attemptNumber === 1) {
			setTransactionTraceId(traceId);
			msg.transactionTraceId = traceId;
		}
		console.log("transaction trace id to use", msg.transactionTraceId);

		const recaptchaAuthenticator = attemptNumber === 1 ? authenticateWithRecaptchaV3 : authenticateWithRecaptchaV2;
		const useLegacyRecaptcha = attemptNumber !== 1;

		return new Promise(async (resolve, reject) => {

			if (!(sourceChain?.chainSymbol && destinationChain?.chainSymbol && destinationAddress && sourceAsset)) {
				reject("no input params");
				return;
			}

			try {
				let recaptchaToken: string;

				try {
					recaptchaToken = await recaptchaAuthenticator();
				} catch (e: any) {
					const msg: string = `Oops: Failed Recaptcha (${useLegacyRecaptcha ? "V2" : "V3"}) authentication\
						from this site - your request didn't even hit our servers`;
					notificationHandler.notifyError({ statusCode: 403, message: msg });
					console.log("eeeee from usePost",e);
					throw new Error(msg + e);
				}

				try {
					setShowTransactionStatusWindow(true);
					setShowRecaptchaV2Retry(false);
					const res = await postRequest(traceId, recaptchaToken, attemptNumber, useLegacyRecaptcha);
					resolve(res);
				} catch (e: any) {
					setShowTransactionStatusWindow(false);
					if (!e.traceId) { e.traceId = traceId}
					reject(e);
					throw new Error(e);
				}
			} catch (err: any) {
				//todo log recpatcha v3 error
				console.log("recaptcha error from frontend",err);
			}

		})
	}, [sourceChain, destinationChain, destinationAddress, notificationHandler, setShowTransactionStatusWindow, setTransactionTraceId,
		sourceAsset, authenticateWithRecaptchaV3, msg, postRequest, authenticateWithRecaptchaV2, setShowRecaptchaV2Retry
	]);

	const closeResultsScreen = () => setShowTransactionStatusWindow(false);

	return [showTransactionStatusWindow as boolean,
		handleTransactionSubmission as (attemptNumber: number) => Promise<string>,
		closeResultsScreen as () => void
	] as const;
}