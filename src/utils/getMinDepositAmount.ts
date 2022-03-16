import { AssetInfo, ChainInfo } from "@axelar-network/axelarjs-sdk"
import BigNumber from "decimal.js"
import { Nullable } from "interface/Nullable"

export const getMinDepositAmount = (
  sourceAsset: Nullable<AssetInfo>,
  sourceChain: Nullable<ChainInfo>,
  destinationChain: Nullable<ChainInfo>
) => {
  if (!sourceAsset || !sourceChain || !destinationChain) return null

  const minDepAmtOnDestChain: number | undefined =
  destinationChain?.assets?.find(
    (asset) => asset.common_key === sourceAsset?.common_key
  )?.minDepositAmt

  const minDepAmtOnSrcChain: number | undefined =
    sourceChain?.assets?.find(
      (asset) => asset.common_key === sourceAsset?.common_key
    )?.minDepositAmt

  if (!minDepAmtOnDestChain || !minDepAmtOnSrcChain) return null

  return new BigNumber(minDepAmtOnDestChain).add(minDepAmtOnSrcChain).toNumber()
}
