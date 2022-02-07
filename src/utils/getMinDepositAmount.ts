import {AssetInfo, ChainInfo} from "@axelar-network/axelarjs-sdk";
import BigNumber              from "decimal.js";
import {Nullable}             from "interface/Nullable";
import {roundUp}              from "./roundUp";

export const getMinDepositAmount = (sourceAsset: Nullable<AssetInfo>, destinationChain: Nullable<ChainInfo>) => {

	if (!sourceAsset || !destinationChain)
		return null;

	const minDepAmtOnDestChain: number | undefined = destinationChain?.assets?.find(asset => asset.common_key === sourceAsset?.common_key)?.minDepositAmt;

	if (!minDepAmtOnDestChain)
		return null;

	return roundUp((new BigNumber(minDepAmtOnDestChain)).toNumber());
}

