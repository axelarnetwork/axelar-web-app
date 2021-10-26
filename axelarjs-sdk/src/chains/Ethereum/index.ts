import WaitingService                                                                   from "./WaitingService";
import {isAddress as isValidEVMAddress}                                                 from "ethers/lib/utils";
import {IAssetInfo, IBlockchainWaitingService, IChain, IChainInfo, SourceOrDestination} from "../../interface";
import EthersJsWaitingService                                                           from "./EthersJsWaitingService";

export default class Ethereum implements IChain {

	public chainInfo: IChainInfo = {
		chainSymbol: "ETH",
		chainName: "Ethereum",
		assets: [
			{assetSymbol: "uaxl", assetName: "Axelar"},
			{assetSymbol: "axelarPHOT", assetName: "Photon"},
		]
	};

	constructor() {
	}

	public validateAddress = (addressInfo: IAssetInfo) => isValidEVMAddress(addressInfo.assetAddress as string);

	public waitingService = (chainInfo: IChainInfo, assetInfo: IAssetInfo, sOrDChain: SourceOrDestination) => {
		const map: { [key in SourceOrDestination]: IBlockchainWaitingService } = {
			"source": new WaitingService(chainInfo, assetInfo),
			"destination": new EthersJsWaitingService(chainInfo, assetInfo)
		};
		if (!map[sOrDChain])
			throw new Error("Ethereum: cannot get waiting service");
		return map[sOrDChain];
	}
}