import {
	IAssetTransferObject,
	ILinkRequestBody,
	INonSmartContractLinkRequestBody, ISmartContractLinkRequestBody,
	LinkType
} from "@axelar-network/axelarjs-sdk";

export const constructLinkBody = (payload: IAssetTransferObject): ILinkRequestBody => {
	let bodyObj: ILinkRequestBody;
	if (payload?.sourceTokenInfo?.tokenSymbol === "BTC") {
		bodyObj = {
			"@type": LinkType.BITCOIN,
			"sender": "",
			"recipient_addr": payload.destinationTokenInfo.tokenAddress,
			"recipient_chain": payload.destinationTokenInfo.tokenSymbol
		} as INonSmartContractLinkRequestBody
	} else {
		bodyObj = {
			"@type": LinkType.EVM,
			"sender": "",
			"recipient_addr": payload.destinationTokenInfo.tokenAddress,
			"recipient_chain": payload.destinationTokenInfo.tokenSymbol,
			"chain": payload.sourceTokenInfo.tokenSymbol,
			"asset": payload.sourceAsset.symbol,
		} as ISmartContractLinkRequestBody
	}
	return bodyObj;
}