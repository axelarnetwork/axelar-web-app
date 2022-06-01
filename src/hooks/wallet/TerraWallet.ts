import { WalletInterface } from "./WalletInterface"
import { ConnectedWallet, Wallet } from "@terra-money/wallet-provider"
import { Coin, Fee, LCDClient, MsgTransfer } from "@terra-money/terra.js"
import { ConnectType } from "@terra-money/wallet-provider"
import { ethers } from "ethers"
import { TERRA_IBC_GAS_LIMIT } from "config/gas"
import { KeplrWalletChainConfig } from "config/wallet/axelarnet/interface"
import { Height } from "@terra-money/terra.js/dist/core/ibc/msgs/client/Height"
import { AssetConfig, AssetInfo, loadAssets } from "@axelar-network/axelarjs-sdk"

export const terraConfigMainnet = {
  URL: "https://phoenix-lcd.terra.dev",
  chainId: "phoenix-1",
}

export const terraConfigTestnet = {
  URL: "https://pisco-lcd.terra.dev",
  chainId: "pisco-1",
}
export class TerraWallet implements WalletInterface {
  public wallet: Wallet
  public connectedWallet?: ConnectedWallet
  public lcdClient: LCDClient
  public chainConfig: KeplrWalletChainConfig
  public static ENVIRONMENT: string = process.env.REACT_APP_STAGE === "local"
  ? "testnet"
  : (process.env.REACT_APP_STAGE as string)
  public static ALL_ASSETS: AssetConfig[] = loadAssets({ environment: TerraWallet.ENVIRONMENT })

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
    if (!this.isWalletInstalled()) return this.installWallet()
    await this.wallet.connect(ConnectType.EXTENSION)
  }

  public installWallet(): void {
    const confirm = window.confirm(
      "Click OK to be brought to the Chrome Store to download Terra Station. Please ensure your Terra Station account is set up before returning to Satellite."
    )
    if (confirm) {
      window.open(
        "https://chrome.google.com/webstore/detail/terra-station-wallet/aiifbnbfobpmeekipheeijimdpnlpgpp",
        "_blank"
      )
    }
  }

  public async getAddress(): Promise<string> {
    console.log("this wallet",this.wallet)
    return this.wallet?.wallets[0]?.terraAddress
  }

  public async getBalance(assetInfo: AssetInfo): Promise<number> {
    // const denom = assetInfo.common_key || "";
    const denom = (TerraWallet.ALL_ASSETS.find( assetConfig => assetConfig.common_key[TerraWallet.ENVIRONMENT] === assetInfo.common_key)?.chain_aliases["terra"])?.ibcDenom;
    if (!denom) throw new Error("asset not found: " + assetInfo.common_key);
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

  public async ibcTransfer(
    recipientAddress: string,
    amount: string,
    _denom: string
  ): Promise<any> {
    const sourcePort = "transfer"
    const senderAddress = await this.getAddress()
    // const denom = this.chainConfig?.denomMap
    //   ? this.chainConfig.denomMap[_denom]
    //   : _denom
    const denom = (TerraWallet.ALL_ASSETS.find( assetConfig => assetConfig.common_key[TerraWallet.ENVIRONMENT] === _denom)?.chain_aliases["terra"])?.ibcDenom;
    if (!denom) throw new Error("asset not found: " + _denom);
    const fee = new Fee(parseInt(TERRA_IBC_GAS_LIMIT), "30000uluna")
    const transferMsg: MsgTransfer = new MsgTransfer(
      sourcePort,
      this.chainConfig.channelMap["axelar"],
      new Coin(denom, ethers.utils.parseUnits(amount, 6).toString()),
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
