import { AssetInfo } from "@axelar-network/axelarjs-sdk"
import { nativeAssetMap } from "config/contracts/deployedContractAddresses"

export const hasSelectedNativeAssetForChain = (
  assetInfo: AssetInfo,
  sourceChainName?: string
): boolean => {
  const env = process.env.REACT_APP_STAGE === "mainnet" ? "mainnet" : "testnet"
  return (
    nativeAssetMap[env][sourceChainName?.toLowerCase() || ""] ===
    assetInfo.common_key
  )
}
