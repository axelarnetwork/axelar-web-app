import { AssetInfo } from "@axelar-network/axelarjs-sdk"

export interface WalletInterface {
  isWalletInstalled(): Boolean

  connectToWallet(cb?: any): void

  installWallet(): void

  getAddress(): Promise<string>

  getBalance(assetInfo: AssetInfo, sourceChainName?: string): Promise<any>

  getSigner(): any

  switchChain(chain?: string): void

  transferTokens(
    receiver: string,
    amount: string,
    asset: string | AssetInfo
  ): void
}
