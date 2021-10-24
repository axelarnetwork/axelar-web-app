import {IAsset, ISupportedChainType}                               from "../../constants";
import ChainList                                                   from "../../chains/ChainList";
import {IAssetInfo, IBlockchainWaitingService, IChain, IChainInfo} from "../../chains/models/Chains";

const waitingServiceMap: { [chainKey: string]: (chainInfo: IChainInfo, assetInfo: IAssetInfo) => IBlockchainWaitingService } = {};

ChainList.forEach((chainInfo: IChain) => {
	const chainKey: string = chainInfo.chainInfo.chainSymbol.toLowerCase();
	waitingServiceMap[chainKey] = chainInfo.waitingService as (
		chainInfo: IChainInfo, assetInfo: IAssetInfo) => IBlockchainWaitingService
});

const getWaitingService = (type: string, chainInfo: ISupportedChainType, tokenInfo: IAsset) => {
	return waitingServiceMap[type.toLowerCase()](chainInfo, tokenInfo);
};

export default getWaitingService;