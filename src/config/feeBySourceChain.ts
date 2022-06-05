import { ChainInfo } from "@axelar-network/axelarjs-sdk"

export const feeBySourceChain = (sourceChain: ChainInfo) => {
  if (!sourceChain) return ""

  if (sourceChain?.module === "axelarnet") return "~2-5 minutes"

  if (["ethereum", "polygon"].includes(sourceChain?.chainName.toLowerCase()))
    return "~15-20 minutes"

  return "~3-5 minutes"
}
