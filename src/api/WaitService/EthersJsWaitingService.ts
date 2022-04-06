
import { ChainInfo } from "@axelar-network/axelarjs-sdk"
import axios from "axios"
import { Contract, ethers } from "ethers"
import { formatEther } from "ethers/lib/utils"
import {
  ConfigsForEnvironment,
  EthersJsConfigs,
  getConfigs,
} from "./constants"
import { getEthersJsProvider, ProviderType } from "./ethersJsProvider"

const abi: string[] = [
  "function name() view returns (string)",
  "function symbol() view returns (string)",
  "function balanceOf(address) view returns (uint)",
  "event Transfer(address indexed from, address indexed to, uint amount)",
]

export default class EthersJsWaitingService {
  private provider!: ethers.providers.BaseProvider
  private tokenContract!: Contract
  private filter!: ethers.EventFilter
  private chainInfo: ChainInfo
  private assetCommonKey: string
  private address: string

  constructor(chainInfo: ChainInfo, assetCommonKey: string, address: string) {
    this.chainInfo = chainInfo
    this.assetCommonKey = assetCommonKey
    this.address = address
  }

  public static async build(
    chainInfo: ChainInfo,
    assetCommonKey: string,
    address: string
  ): Promise<EthersJsWaitingService> {
    const api: EthersJsWaitingService = new EthersJsWaitingService(
      chainInfo,
      assetCommonKey,
      address
    )
    await api.init(chainInfo, assetCommonKey, address)
    return api
  }

  public async wait(): Promise<void> {
    return new Promise((resolve, reject) => {
      this.tokenContract.once(
        this.filter,
        (from: any, to: any, amount: any, event: any) => {
          console.log(
            `Incoming amount of: ${formatEther(amount)}, from: ${from}.`,
            event
          )
          event.axelarRequiredNumConfirmations = this.chainInfo.confirmLevel
          resolve(event)
        }
      )
    })
  }

  private async init(
    chainInfo: ChainInfo,
    assetCommonKey: string,
    address: string
  ) {
    let tokenContract: string = await this.getOrFetchTokenAddress(
      chainInfo.chainName,
      assetCommonKey
    )

    console.log(
      "EthersJsWaitingService token contract :",
      tokenContract + " on: " + chainInfo.chainName
    )

    this.provider = getEthersJsProvider(
      chainInfo.chainName.toLowerCase() as ProviderType,
      process.env.REACT_APP_STAGE as string
    )
    this.tokenContract = new ethers.Contract(tokenContract, abi, this.provider)
    this.filter = this.tokenContract.filters.Transfer(null, address) //filter all transfers TO my address
  }

  public async getOrFetchTokenAddress(
    chainName: string,
    assetCommonKey: string
  ): Promise<string> {
    const configs: ConfigsForEnvironment = getConfigs(
      process.env.REACT_APP_STAGE as string
    )
    const ethersJsConfigs: { [chain: string]: EthersJsConfigs } =
      configs.ethersJsConfigs
    const { tokenAddressMap } = ethersJsConfigs[chainName.toLowerCase()]
    let tokenContract: string = ""

    if (tokenAddressMap[assetCommonKey]) {
      tokenContract = tokenAddressMap[assetCommonKey] as string
    } else {
      const endpoint = `/token-address?module=evm&chain=${chainName.toLowerCase()}&asset=${assetCommonKey}`
      try {
        const response = await axios.get(configs.resourceUrl + endpoint)
        tokenContract = response.data.data
        tokenAddressMap[assetCommonKey] = tokenContract
      } catch (error) {
        console.error(error)
      }
    }
    return tokenContract
  }
}
