import {IAsset}             from "../constants";
import {IAssetInfo, IChain} from "../chains/models/Chains";
import ChainList            from "../chains/ChainList";

const validatorsDict: { [chainSymbol: string]: (asset: IAssetInfo) => boolean } = {};
ChainList.forEach((chain: IChain) => {
	const key = chain.chainInfo.chainName.toLowerCase();
	validatorsDict[key] = chain.validateAddress as (asset: IAssetInfo) => boolean
})

export const validateDestinationAddress = (destTokenInfo: IAsset): boolean => {

	const destTokenSymbol: string = destTokenInfo?.assetSymbol as string;
	const validator: (assetInfo: IAssetInfo) => boolean = validatorsDict[destTokenSymbol?.toLowerCase()];

	// TODO: what should we do if we don't have a validator for supported chain?
	if (!validator)
		return true;

	return validator(destTokenInfo);

}