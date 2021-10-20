import {
	IAssetTransferObject,
	IBTCLinkRequestBody,
	IEVMLinkRequestBody,
	ILinkRequestBody,
	LinkType
}            from "@axelar-network/axelarjs-sdk";
import axios from "axios";

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

export const handleRecaptcha = (token: string): Promise<any> => {

	const secret_key = process.env.GOOGLE_RECAPTCHA_V3_SECRET_KEY;
	const url = `https://www.google.com/recaptcha/api/siteverify?secret=${secret_key}&response=${token}`;

	return new Promise((resolve, reject) => {
		axios.post(url)
		.then(google_response => resolve(google_response.data))
		.catch(error => reject({error}));
	});

};