import {
	IAssetTransferObject,
	ILinkRequestBody,
	IBTCLinkRequestBody,
	IEVMLinkRequestBody,
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
		} as IBTCLinkRequestBody
	} else {
		bodyObj = {
			"@type": LinkType.EVM,
			"sender": "",
			"recipient_addr": payload.destinationTokenInfo.tokenAddress,
			"recipient_chain": payload.destinationTokenInfo.tokenSymbol,
			"chain": payload.sourceTokenInfo.tokenSymbol,
			"asset": payload.sourceAsset.symbol,
		} as IEVMLinkRequestBody
	}
	return bodyObj;
}