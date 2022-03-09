import { WalletInterface } from "./WalletInterface"
import { ConnectedWallet, Wallet } from "@terra-money/wallet-provider"
import { Coin, Fee, LCDClient, MsgTransfer } from "@terra-money/terra.js"
import { ConnectType } from "@terra-money/wallet-provider"
import { ethers } from "ethers"
import { TERRA_IBC_GAS_LIMIT } from "config/gas"
import { KeplrWalletChainConfig } from "config/wallet/axelarnet/interface"
import { Height } from "@terra-money/terra.js/dist/core/ibc/msgs/client/Height"

export class TerraWallet implements WalletInterface {
  public wallet: Wallet
  public connectedWallet?: ConnectedWallet
  public lcdClient: LCDClient
  public chainConfig: KeplrWalletChainConfig

  public constructor(
    wallet: Wallet,
    lcdClient: LCDClient,
    connectedWallet?: ConnectedWallet
  ) {
    this.wallet = wallet
    this.lcdClient = lcdClient
    this.connectedWallet = connectedWallet

    const configs =
      require(`config/wallet/axelarnet/${process.env.REACT_APP_STAGE}.ts`).default
    this.chainConfig = configs["terra"]
  }

  public isWalletInstalled(): boolean {
    return this.wallet.availableConnectTypes.includes(ConnectType.EXTENSION)
  }

  public async connectToWallet(): Promise<any> {
    await this.wallet.connect(ConnectType.EXTENSION)
  }

  public installWallet(): void {
    const confirm = window.confirm(
      "Click OK to be brought to the Chrome Store to download the Terra Station. Please (1) set up an Keplr account and (2) refresh this Satellite page before trying this again."
    )
    if (confirm) {
      window.open(
        "https://chrome.google.com/webstore/detail/terra-station-wallet/aiifbnbfobpmeekipheeijimdpnlpgpp",
        "_blank"
      )
    }
  }

  public async getAddress(): Promise<string> {
    return this.wallet.wallets[0].terraAddress
  }

  public async getBalance(denom: string): Promise<number> {
    const address = await this.getAddress()
    const balance = await this.lcdClient.bank
      .balance(address)
      .then(([coins]) => coins.get(denom)?.amount.toNumber() || 0)
    return parseFloat(ethers.utils.formatUnits(balance, 6))
  }

  // We don't need to use the following functions for terra wallet
  public async getSigner() {}
  public async switchChain(chainId: string) {}
  public async transferTokens(
    depositAddress: string,
    amount: string
  ): Promise<any> {}

  public async ibcTransferFromTerra(
    recipientAddress: string,
    coinToSend: Coin
  ): Promise<any> {
    const sourcePort = "transfer"
    const senderAddress = await this.getAddress()
    const denom = this.chainConfig?.denomMap
      ? this.chainConfig.denomMap[coinToSend.denom]
      : coinToSend.denom
    const fee = new Fee(parseInt(TERRA_IBC_GAS_LIMIT), "30000uluna")
    const transferMsg: MsgTransfer = new MsgTransfer(
      sourcePort,
      this.chainConfig.channelMap["axelar"],
      new Coin(
        denom,
        ethers.utils.parseUnits(coinToSend.amount.toString(), 6).toString()
      ),
      senderAddress,
      recipientAddress,
      new Height(100, 100),
      undefined
    )

    const signTx = await this.connectedWallet?.sign({
      msgs: [transferMsg],
      timeoutHeight: 100,
      fee,
    })
    if (!signTx) throw Error("sign tx failed")
    return this.lcdClient.tx.broadcastSync(signTx.result)
  }
}
