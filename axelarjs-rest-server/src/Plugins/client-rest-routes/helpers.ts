import {
	IAssetTransferObject,
	IBTCLinkRequestBody, ICOSLinkRequestBody,
	IEVMLinkRequestBody,
	ILinkRequestBody,
	LinkType
} from "@axelar-network/axelarjs-sdk";
import axios from "axios";

const linkRequestTypes: { [key: string]: (payload: IAssetTransferObject) => ILinkRequestBody } = {}

linkRequestTypes.btc = (payload: IAssetTransferObject) => ({
	"@type": LinkType.BITCOIN,
	"sender": "",
	"recipient_addr": payload.selectedDestinationAsset.assetAddress,
	"recipient_chain": payload.destinationChainInfo.chainSymbol
} as IBTCLinkRequestBody)

linkRequestTypes.eth = (payload: IAssetTransferObject) => ({
	"@type": LinkType.EVM,
	"sender": "",
	"recipient_addr": payload.selectedDestinationAsset.assetAddress,
	"recipient_chain": payload.destinationChainInfo.chainSymbol,
	"chain": payload.sourceChainInfo.chainSymbol,
	"asset": payload.selectedSourceAsset.assetSymbol
} as IEVMLinkRequestBody)

linkRequestTypes.cos = (payload: IAssetTransferObject) => ({
	"@type": LinkType.COS,
	"sender": "",
	"recipient_addr": payload.selectedDestinationAsset.assetAddress,
	"recipient_chain": payload.destinationChainInfo.chainSymbol,
	"asset": payload.selectedSourceAsset.assetSymbol
} as ICOSLinkRequestBody)

export const constructLinkBody = (payload: IAssetTransferObject): ILinkRequestBody => {
	if (!linkRequestTypes[payload?.sourceChainInfo?.chainSymbol?.toLowerCase()])
		throw new Error("link not does not exist");

	return linkRequestTypes[payload?.sourceChainInfo?.chainSymbol?.toLowerCase()](payload);
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