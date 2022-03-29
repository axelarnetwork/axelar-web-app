import { loadAssets } from "@axelar-network/axelarjs-sdk"

export function buildDepositConfirmationRoomId(
  module: string,
  depositAddress: string,
  sourceChainName: string,
  destinationChainName: string,
  assetCommonKey: string
): string {
  return module === "evm"
    ? buildEvmDepositConfirmationRoomId(
        depositAddress,
        sourceChainName.toLowerCase(),
        destinationChainName.toLowerCase(),
        assetCommonKey
      )
    : buildCosmosDepositConfirmationRoomId(
        depositAddress,
        sourceChainName.toLowerCase(),
        destinationChainName.toLowerCase(),
        assetCommonKey
      )
}
function buildEvmDepositConfirmationRoomId(
  depositAddress: string, // user address
  sourceChainName: string,
  destinationChainName: string,
  assetCommonKey: string
): string {
  return `depositConfirmation-module=${"evm"}-sourceChainName=${sourceChainName}-destinationChainName=${destinationChainName}-assetCommonKey=${assetCommonKey}-depositAddress=${depositAddress}`
}

function buildCosmosDepositConfirmationRoomId(
  depositAddress: string,
  sourceChainName: string,
  destinationChainName: string,
  assetCommonKey: string
): string {
  return `depositConfirmation-module=${"axelarnet"}-sourceChainName=${"Axelarnet"}-destinationChainName=${destinationChainName}-assetCommonKey=${assetCommonKey}-depositAddress=${depositAddress}`
}

export function buildTransferCompletedRoomId(
  recipientAddress: string,
  sourceChainName: string,
  destinationChainName: string,
  assetCommonKey: string
): string {
  const environment = process.env.REACT_APP_STAGE === "local" ? "testnet" : process.env.REACT_APP_STAGE as string
  const asset = loadAssets({ environment }).find(
    (asset) =>
      asset.common_key[environment] === assetCommonKey
  )
  debugger;
  if (asset)
    return `transfer_completed-${asset.chain_aliases["axelar"].fullDenomPath}-${recipientAddress}`
  else throw new Error("asset not found in topic")
}
