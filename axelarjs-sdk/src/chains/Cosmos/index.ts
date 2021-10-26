import WaitingService                   from "./WaitingService";
import {IAssetInfo, IChain, IChainInfo} from "../../interface";

export default class Cosmos implements IChain {

	public chainInfo: IChainInfo = {
		chainSymbol: "COS",
		chainName: "Cosmos",
		noteOnWaitTimes: "Confirmations on Cosmos should only take a few minutes",
		assets: [
			{assetSymbol: "uphoton", assetName: "Cosmos Hub"},
			{assetSymbol: "LUNA", assetName: "Terra (To be supported)"},
		]
	};

	constructor() {
	}

	public validateAddress = (addressInfo: IAssetInfo) => true;

	public waitingService = (chainInfo: IChainInfo, assetInfo: IAssetInfo) => new WaitingService(chainInfo, assetInfo)

}