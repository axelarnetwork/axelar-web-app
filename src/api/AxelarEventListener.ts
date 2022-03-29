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
        sourceChainName,
        destinationChainName,
        assetCommonKey
      )
    : buildCosmosDepositConfirmationRoomId(
        depositAddress,
        sourceChainName,
        destinationChainName,
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
  return `depositConfirmation-module=${"axelarnet"}-sourceChainName=${'Axelarnet'}-destinationChainName=${destinationChainName}-assetCommonKey=${assetCommonKey}-depositAddress=${depositAddress}`
}
