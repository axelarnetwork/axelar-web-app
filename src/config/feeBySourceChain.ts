import { ChainInfo } from "@axelar-network/axelarjs-sdk"

export const feeBySourceChain = (sourceChain: ChainInfo) => {
  if (!sourceChain) return ""

  if (sourceChain?.module === "axelarnet") return "~2 minutes"

  if (["ethereum", "polygon"].includes(sourceChain?.chainName.toLowerCase()))
    return "~15 minutes"

  return "~3 minutes"
}
