import {IAssetInfo, IChain, IChainInfo} from "../models/Chains";
import WaitingService                   from "./WaitingService";

export default class Cosmos implements IChain {

	constructor() {}

	public chainInfo: IChainInfo = {
		chainSymbol: "COS",
		chainName: "Cosmos",
		assets: [
			{assetSymbol: "uPHOTON", assetName: "Cosmos Hub"},
			{assetSymbol: "LUNA", assetName: "Terra (To be supported)"},
		]
	};

	public validateAddress = (addressInfo: IAssetInfo) => true;

	public waitingService = (chainInfo: IChainInfo, assetInfo: IAssetInfo) => new WaitingService(chainInfo, assetInfo)

}