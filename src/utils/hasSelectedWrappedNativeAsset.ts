import { AssetInfo } from "@axelar-network/axelarjs-sdk"
import { wrappedAssetMap } from "config/contracts/deployedContractAddresses"

export const hasSelectedWrappedNativeAsset = (
  assetInfo: AssetInfo,
  sourceChainName?: string
): boolean => {
  if (!assetInfo || !sourceChainName) return false
  const env = process.env.REACT_APP_STAGE === "mainnet" ? "mainnet" : "testnet"
  return (
    wrappedAssetMap[env][sourceChainName?.toLowerCase() || ""] ===
    assetInfo.common_key
  )
}
