import {ITokenAddress} from "./IMiscTopics";
import {IAsset}        from "../constants";

export interface IAssetTransferObject {
	sourceTokenInfo: ITokenAddress;
	sourceAsset: IAsset;
	destinationTokenInfo: ITokenAddress;
}

/*
non-smart-contract
{
   "@type":"/bitcoin.v1beta1.LinkRequest",
   "sender":"cosmos1fqashy22wc9kmlp37z8wflqjayf3nun7utjljx",
   "recipient_addr":"5cbfb25b91",
   "recipient_chain":"ethereum"
}

smart-contract
{
	"@type":"/evm.v1beta1.LinkRequest",
	"sender":"cosmos1vycmh4r63wtkms8zq9m8mjaqvgrjc85e9z3srg",
	"chain":"ethereum",
	"recipient_addr":"6bcf43e3e1",
	"asset":"8GEBrN",
	"recipient_chain":"solana"}
* */
export enum LinkType {
	BITCOIN = "/bitcoin.v1beta1.LinkRequest",
	ETHEREUM = "/evm.v1beta1.LinkRequest"
}

export interface ILinkRequestBody {
	"@type": LinkType;
	"sender": string;
	"recipient_addr": string;
	"recipient_chain": string;
}

export interface INonSmartContractLinkRequestBody extends ILinkRequestBody {}
export interface ISmartContractLinkRequestBody extends ILinkRequestBody {
	"chain": string; //source chain
	"asset": string;
}