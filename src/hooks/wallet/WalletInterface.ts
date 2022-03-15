import { AssetInfo } from "@axelar-network/axelarjs-sdk"

export interface WalletInterface {
  isWalletInstalled(): Boolean

  connectToWallet(): void

  installWallet(): void

  getAddress(): Promise<string>

  getBalance(assetSymbol?: string | AssetInfo): Promise<any>

  getSigner(): any

  switchChain(chain?: string): void

  transferTokens(
    receiver: string,
    amount: string,
    asset: string | AssetInfo
  ): void
}
