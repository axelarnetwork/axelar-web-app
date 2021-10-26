import WaitingService                   from "./WaitingService";
import {IAssetInfo, IChain, IChainInfo} from "../../interface";
import Cosmos                           from "../Cosmos";

export default class Axelar extends Cosmos implements IChain {

	public chainInfo: IChainInfo = {
		chainSymbol: "AXL",
		chainName: "Axelar",
		noteOnWaitTimes: "Confirmations on Axelar should only take a few minutes",
		assets: [
			{assetSymbol: "uphoton", assetName: "Photon"},
		]
	};

	constructor() {
		super();
	}

	// public validateAddress = (addressInfo: IAssetInfo) => true;
	//
	// public waitingService = (chainInfo: IChainInfo, assetInfo: IAssetInfo) => new WaitingService(chainInfo, assetInfo)

}