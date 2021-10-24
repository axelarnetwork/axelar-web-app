import {IAssetInfo, IChain, IChainInfo} from "../models/Chains";
import {WaitingService}                 from "./WaitingService";
import {validate as isValidBTCAddress}  from "bitcoin-address-validation";

export class Bitcoin implements IChain {

	public chainInfo: IChainInfo = {
		chainSymbol: "BTC",
		chainName: "Bitcoin",
		assets: [
			{assetSymbol: "BTC", assetName: "Bitcoin"}
		]
	}

	constructor() {
	}

	public validateAddress(addressInfo: IAssetInfo) {
		return isValidBTCAddress(addressInfo.assetAddress as string);
	}

	public waitingService(chainInfo: IChainInfo, assetInfo: IAssetInfo) {
		return new WaitingService(chainInfo, assetInfo);
	}

}