import { WalletInterface } from "./WalletInterface"
import { SigningStargateClient, StdFee } from "@cosmjs/stargate"
import { OfflineSigner } from "@cosmjs/launchpad"
import { ethers } from "ethers"
import { Coin } from "cosmjs-types/cosmos/base/v1beta1/coin"
import { ChainInfo } from "@keplr-wallet/types"
import Long from "long"
import { Height } from "cosmjs-types/ibc/core/client/v1/client"
import { KeplrWalletChainConfig } from "config/wallet/axelarnet/interface"
import { getShortenedWord } from "utils/wordShortener"
import { SendLogsToServer } from "../../api/SendLogsToServer"
import { AXELAR_TRANSFER_GAS_LIMIT, TERRA_IBC_GAS_LIMIT } from "config/gas"
import {
  AssetInfo,
  Environment,
} from "@axelar-network/axelarjs-sdk"
import { ALL_ASSETS } from "index"

declare const window: Window &
  typeof globalThis & {
    keplr: any
  }

export class KeplrWallet implements WalletInterface {
  public CHAIN_ID: string
  public RPC_ENDPOINT: string
  public CHAIN_INFO: ChainInfo
  public CONFIG_FOR_CHAIN: KeplrWalletChainConfig
  public CHAIN_NAME: string
  public static ENVIRONMENT: Environment = process.env.REACT_APP_STAGE === "local"
  ? "testnet" as Environment
  : (process.env.REACT_APP_STAGE as Environment)

  public constructor(chainName: string) {
    const configs =
      require(`config/wallet/axelarnet/${process.env.REACT_APP_STAGE}.ts`).default
    const configForChain = configs[chainName]
    this.CHAIN_ID = configForChain?.chainId
    this.RPC_ENDPOINT = configForChain?.rpcEndpoint
    this.CHAIN_INFO = configForChain?.chainInfo
    this.CHAIN_NAME = chainName
    this.CONFIG_FOR_CHAIN = configForChain
  }

  public isWalletInstalled(): boolean {
    return !!window.keplr
  }

  public async connectToWallet(
    cb?: any
  ): Promise<"added" | "exists" | "error" | null> {
    let text: "added" | "exists" | "error" | null = "error"

    if (!this.isWalletInstalled()) {
      this.installWallet()
      return null
    }

    try {
      await window.keplr.enable(this.CHAIN_ID)
      text = "exists"
    } catch (e) {
      console.log(
        "KeplrWallet connectToWallet - unable to connect to wallet natively, so trying experimental chain",
        e,
        this.CHAIN_ID,
        getShortenedWord(this.RPC_ENDPOINT, 20)
      )
      try {
        await window.keplr.experimentalSuggestChain(this.CHAIN_INFO)
        await window.keplr.enable(this.CHAIN_ID)
        text = "added"
      } catch (e2: any) {
        console.log("and yet there is a problem in trying to do that too", e2)
        SendLogsToServer.info(
          "KeplrWallet_connectToWallet",
          JSON.stringify(e2),
          "NO_UUID"
        )
        return text
      }
    }
    cb && cb()
    const _signer = await window.keplr.getOfflineSignerAuto(this.CHAIN_ID)
    const [account] = await _signer.getAccounts()
    console.log(account)
    return text
  }

  public installWallet(): void {
    const confirm = window.confirm(
      "Click OK to be brought to the Chrome Store to download the Keplr Wallet. Please ensure your Keplr account is set up before returning to Satellite."
    )
    if (confirm) {
      window.open(
        "https://chrome.google.com/webstore/detail/keplr/dmkamcknogkgcdfhhbddcghachkejeap?hl=en",
        "_blank"
      )
    }
  }

  public async getAddress(): Promise<string> {
    const _signer = await this.getSigner()
    const [account] = await _signer.getAccounts()
    return account.address
  }

  public async getBalance(assetInfo: AssetInfo): Promise<number> {
    const { decimals } = assetInfo
    const derivedDenom = (ALL_ASSETS.find( assetConfig => assetConfig.common_key[KeplrWallet.ENVIRONMENT] === assetInfo.common_key)?.chain_aliases[this.CHAIN_NAME])?.ibcDenom;
    if (!derivedDenom) throw new Error("asset not found: " + assetInfo?.common_key);
    console.log("derived denom", assetInfo, derivedDenom)
    const cosmjs = await this.getSigningClient()
    const balanceResponse: Coin = await cosmjs.getBalance(
      await this.getAddress(),
      derivedDenom
    )
    const balance = ethers.utils.formatUnits(balanceResponse.amount, decimals)
    return +balance
  }

  public async getSigner(): Promise<OfflineSigner> {
    const signer: OfflineSigner = window.keplr?.getOfflineSignerAuto(
      this.CHAIN_ID
    )
    return signer
  }

  public async getSigningClient(): Promise<SigningStargateClient> {
    const cosmjs = await SigningStargateClient.connectWithSigner(
      this.RPC_ENDPOINT,
      await this.getSigner()
    )
    return cosmjs
  }

  public async switchChain(chainId: string) {
    this.CHAIN_ID = chainId
    await this.connectToWallet()
  }

  public async transferTokens(
    depositAddress: string,
    amount: string,
    asset: AssetInfo,
    ): Promise<any> {
    const { ibcDenom, decimals } = asset;
    const senderAddress = await this.getAddress(),
      cosmjs = await this.getSigningClient()
    if (!ibcDenom) throw new Error("asset not found: " + asset);

    const sendCoin = {
      denom: ibcDenom,
      amount: ethers.utils.parseUnits(amount, decimals).toString(),
    }
    const fee: StdFee = {
      gas: AXELAR_TRANSFER_GAS_LIMIT,
      amount: [{ denom: "uaxl", amount: "30000" }],
    }

    let result
    try {
      result = await cosmjs.sendTokens(
        senderAddress,
        depositAddress,
        [sendCoin],
        fee
      )
    } catch (error: any) {
      throw new Error(error)
    }

    console.log("results", result)
    return result;
  }

  public async ibcTransfer(
    recipient: any,
    amount: string,
    _denom: string,
    decimals: number
  ) {
    const senderAddress = await this.getAddress()
    const cosmjs = await this.getSigningClient()
    const PORT: string = "transfer"
    const AXELAR_CHANNEL_ID: string = this.CONFIG_FOR_CHAIN.channelMap["axelar"]
    const denom = (ALL_ASSETS.find( assetConfig => assetConfig.common_key[KeplrWallet.ENVIRONMENT] === _denom)?.chain_aliases[this.CHAIN_NAME])?.ibcDenom;
    console.log("derived denom for ibc transfer",denom);
    if (!denom) throw new Error("asset not found: " + _denom);
    const fee: StdFee = {
      gas: TERRA_IBC_GAS_LIMIT,
      amount: [
        {
          denom:
            this.CONFIG_FOR_CHAIN.chainInfo.feeCurrencies[0].coinMinimalDenom,
          amount: "30000",
        },
      ],
    }
    const timeoutHeight: Height = {
        revisionHeight: Long.fromNumber(10),
        revisionNumber: Long.fromNumber(10),
      },
      timeoutTimestamp = 0

    try {
      const res = await cosmjs.sendIbcTokens(
        senderAddress,
        recipient,
        Coin.fromPartial({
          denom,
          amount: ethers.utils.parseUnits(amount, decimals).toString(),
        }),
        PORT,
        AXELAR_CHANNEL_ID,
        timeoutHeight,
        timeoutTimestamp,
        fee
      )
      console.log(res)
      return res
    } catch (err: any) {
      console.log("unsuccessful IBC transfer", err)
      throw new Error(err)
    }
  }
}
