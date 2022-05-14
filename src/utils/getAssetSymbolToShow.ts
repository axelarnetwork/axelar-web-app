import { AssetInfo, ChainInfo } from "@axelar-network/axelarjs-sdk";

export function getAssetSymbolToShow(sourceChain: ChainInfo, destChain: ChainInfo, selectedToken: AssetInfo, alternative: any) {
    return sourceChain?.module === "axelarnet" && selectedToken.native_chain === destChain?.chainName.toLowerCase() 
    ? destChain?.assets?.find(asset => asset.common_key === selectedToken.common_key)?.assetName || ""
    : alternative
}