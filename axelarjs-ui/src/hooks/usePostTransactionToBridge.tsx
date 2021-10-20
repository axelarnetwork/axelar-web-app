import {useCallback, useState}             from "react";
import {
	BlockCypherResponse,
	IAsset,
	IAssetTransferObject,
	IBlockCypherResponse
}                                          from "@axelar-network/axelarjs-sdk";
import {TransferAssetBridgeFacade}         from "api/TransferAssetBridgeFacade";
import {useRecoilValue, useSetRecoilState} from "recoil";
import {
	ChainSelection,
	DESTINATION_TOKEN_KEY,
	DestinationAddress,
	SOURCE_TOKEN_KEY,
	SourceAsset
}                                          from "state/ChainSelection";
import {
	IConfirmationStatus,
	NumberConfirmations,
	SourceDepositAddress
}                                          from "state/TransactionStatus";
import useRecaptchaAuthenticate            from "./auth/useRecaptchaAuthenticate";

export default function usePostTransactionToBridge() {

	const [showTransactionStatusWindow, setShowTransactionStatusWindow] = useState(false);
	const sourceChain = useRecoilValue(ChainSelection(SOURCE_TOKEN_KEY));
	const destinationChain = useRecoilValue(ChainSelection(DESTINATION_TOKEN_KEY));
	const destinationAddress = useRecoilValue(DestinationAddress);
	const setDepositAddress = useSetRecoilState(SourceDepositAddress);
	const setNumConfirmations = useSetRecoilState(NumberConfirmations);
	const sourceAsset = useRecoilValue(SourceAsset);
	const [isRecaptchaAuthenticated, authenticateWithRecaptcha] = useRecaptchaAuthenticate();

	const handleTransactionSubmission = useCallback(async () => {

		if (!(sourceChain?.chainSymbol && destinationChain?.chainSymbol && destinationAddress && sourceAsset))
			return;

		setShowTransactionStatusWindow(true);

		const successCb: IBlockCypherResponse = (status: BlockCypherResponse): void => {

			console.log("status+++++", status);

			const confirms: IConfirmationStatus = {
				numberConfirmations: null,
				numberRequiredConfirmations: status.axelarRequiredNumConfirmations
			};

			if (status.unconfirmed_txrefs)
				confirms.numberConfirmations = null;
			else if (status?.txrefs?.length)
				confirms.numberConfirmations = status.txrefs[0].confirmations;

			setNumConfirmations(confirms);

		};

		const failCb = (data: any): void => console.log(data);

		const msg: IAssetTransferObject = {
			sourceChainInfo: {...sourceChain, assets: undefined},
			selectedSourceAsset: sourceAsset,
			destinationChainInfo: {...destinationChain, assets: undefined},
			selectedDestinationAsset: {
				assetAddress: destinationAddress
			},
			recaptchaToken: null
		}

		authenticateWithRecaptcha().then(async (token: any) => {
			if (isRecaptchaAuthenticated) {
				msg.recaptchaToken = token;
				const res: IAsset = await TransferAssetBridgeFacade.transferAssets(msg, successCb, failCb);
				setDepositAddress(res);
			}
		})

	}, [sourceChain, destinationChain, destinationAddress, setDepositAddress, setNumConfirmations, sourceAsset, isRecaptchaAuthenticated, authenticateWithRecaptcha]);

	const closeResultsScreen = () => {
		setShowTransactionStatusWindow(false);
	}


	return [showTransactionStatusWindow, handleTransactionSubmission, closeResultsScreen] as const;
}