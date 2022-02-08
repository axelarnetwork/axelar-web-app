import { ChainInfo } from "@keplr-wallet/types"

export interface KeplrWalletChainConfig {
  restEndpoint: string
  chainId: string
  rpcEndpoint: string
  chainInfo: ChainInfo
  channelMap: { [key: string]: string }
}
