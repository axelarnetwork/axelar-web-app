import { Environment, loadAssets } from "@axelar-network/axelarjs-sdk"

export function buildDepositConfirmationRoomId(
  module: string,
  depositAddress: string,
  sourceChainName: string,
  destinationChainName: string,
  assetCommonKey: string
): string {
  const topic = {
    type: "deposit-confirmation",
    sourceModule: module.toLowerCase(),
    depositAddress,
  }

  return JSON.stringify(topic, Object.keys(topic).sort())
}

export async function buildTransferCompletedRoomId(
  destinationAddress: string,
  assetCommonKey: string
): Promise<string> {
  const environment =
    process.env.REACT_APP_STAGE === "local"
      ? "testnet" as Environment
      : (process.env.REACT_APP_STAGE as Environment)
  const asset = (await loadAssets({ environment })).find(
    (asset: any) => asset.common_key[environment] === assetCommonKey
  )
  if (asset) {
    const topic = {
      type: "transfer-complete",
      sourceModule: "evm",
      destinationAddress,
      denom: asset.chain_aliases["axelar"].fullDenomPath,
    }

    return JSON.stringify(topic, Object.keys(topic).sort())
  } else throw new Error("asset not found in topic")
}
