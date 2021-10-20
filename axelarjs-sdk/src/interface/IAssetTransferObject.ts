import {IAsset, ISupportedChainType} from "../constants";

export interface IAssetTransferObject {
	sourceChainInfo: ISupportedChainType;
	selectedSourceAsset: IAsset;
	destinationChainInfo: ISupportedChainType;
	selectedDestinationAsset: IAsset;
	recaptchaToken?: any;
}

export enum LinkType {
	BITCOIN = "/bitcoin.v1beta1.LinkRequest",
	EVM = "/evm.v1beta1.LinkRequest",
	COS = "/cos.v1beta1.LinkRequest",
	ERROR = "error"
}

export interface ILinkRequestBody {
	"@type": LinkType;
	"sender": string;
	"recipient_addr": string;
	"recipient_chain": string;
}

export interface IBTCLinkRequestBody extends ILinkRequestBody {}
export interface IEVMLinkRequestBody extends ILinkRequestBody {
	"chain": string; //source chain
	"asset": string;
}
export interface ICOSLinkRequestBody extends ILinkRequestBody {
	"asset": string;
}