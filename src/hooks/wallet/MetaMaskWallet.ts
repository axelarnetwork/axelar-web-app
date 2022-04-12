import { AssetInfo } from "@axelar-network/axelarjs-sdk"
import axios from "axios"
import { BigNumber, Contract, ethers } from "ethers"
import MetaMaskOnboarding from "@metamask/onboarding"
import { erc20Abi } from "config/wallet/evm/erc20Abi"
import { ChainParam } from "config/wallet/evm/testnet"
import { WalletInterface } from "./WalletInterface"
import { convertAndDepositAbi } from "config/wallet/evm/convertAndDepositAbi"
import { convertAndDepositContractAddress } from "config/contracts/deployedContractAddresses"
import { hasSelectedNativeAssetForChain } from "utils/hasSelectedNativeAssetOnChain"
import { EthersJsTokenMap, getConfigs } from "api/WaitService"

declare const window: Window &
  typeof globalThis & {
    ethereum: any
  }
export type TxOption = {
  maxFeePerGas?: BigNumber
  gasPrice?: BigNumber
}

export interface MetamaskTransferEvent {
  txHash: string
  tokenContractAddress: string
  receiver: string
  amount: string
  error: string
  blockNumber: string
}

export async function createFeeTxOption(
  signer: ethers.providers.JsonRpcSigner
): Promise<TxOption> {
  const feeData = await signer.getFeeData()
  const txOptions: TxOption = {}
  if (feeData.maxFeePerGas) {
    txOptions.maxFeePerGas = feeData.maxFeePerGas.mul(12).div(10)
  } else {
    txOptions.gasPrice = feeData?.gasPrice?.mul(2)
  }
  return txOptions
}

export class MetaMaskWallet implements WalletInterface {
  private provider: ethers.providers.Web3Provider
  private signer: ethers.providers.JsonRpcSigner
  private tokenMap: EthersJsTokenMap
  private chainName: string
  private nodeServerUrl: string

  public constructor(chainName: string) {
    if (!this.isWalletInstalled()) this.installWallet()

    this.chainName = chainName
    this.nodeServerUrl = getConfigs(
      process.env.REACT_APP_STAGE as string
    ).resourceUrl
    this.provider = new ethers.providers.Web3Provider(window.ethereum, "any") //2nd param is network type
    this.signer = this.provider.getSigner()
    this.tokenMap = getConfigs(
      process.env.REACT_APP_STAGE as string
    ).ethersJsConfigs[chainName.toLowerCase()].tokenAddressMap
  }

  public getSigner(): ethers.providers.JsonRpcSigner {
    return this.signer
  }

  public async signMessage(message: string) {
    const signature = await this.getSigner().signMessage(message)
    const address = await this.getAddress()
    // const verification = ethers.utils.verifyMessage(message, signature);
    // console.log("signature and verification",signature, verification, address === verification);
    return { address, signature }
  }

  public isWalletInstalled(): Boolean {
    const { ethereum } = window
    return Boolean(ethereum && ethereum.isMetaMask)
  }

  public async connectToWallet(cb?: any) {
    if (!this.isWalletInstalled()) {
      console.log("need to install wallet")
      this.installWallet()
    } else {
      const params: ChainParam =
        require(`config/wallet/evm/${process.env.REACT_APP_STAGE}.ts`).default[
          this.chainName
        ]

      try {
        await window.ethereum.request({
          method: "wallet_switchEthereumChain",
          params: [{ chainId: params.chainId }],
        })
      } catch (switchError: any) {
        console.warn(
          "error adding chain, so trying wallet_addEthereumChain",
          params
        )
        if (switchError.code === 4902) {
          // This error code indicates that the chain has not been added to MetaMask.
          try {
            await window.ethereum.request({
              method: "wallet_addEthereumChain",
              params: [params],
            })
          } catch (addError) {
            // handle "add" error
            console.warn("error adding chain to metamask", addError)
          }
        }
        // handle other "switch" errors
      }
      cb && cb();
      await this.getAddress()
    }
  }

  public installWallet(): void {
    new MetaMaskOnboarding({
      forwarderOrigin: window.location.href,
    }).startOnboarding()
  }

  public getCurrentNetworkId(): Number {
    return Number(window.ethereum.networkVersion)
  }

  public async switchChain(chainName: string) {
    this.chainName = chainName
    const params: ChainParam =
      require(`config/wallet/evm/${process.env.REACT_APP_STAGE}.ts`).default[
        this.chainName
      ]
    if (Number(params.chainId) !== this.getCurrentNetworkId())
      await this.connectToWallet()
  }

  public async isWalletConnected(): Promise<boolean> {
    return (await this.provider.send("eth_requestAccounts", []))?.length > 0
  }

  public async getAddress(): Promise<string> {
    await this.provider.send("eth_requestAccounts", [])
    this.signer = await this.provider.getSigner()
    const address = await this.signer.getAddress()
    return address
  }

  public async getNativeAssetBalance(
    assetInfo: AssetInfo,
    sourceChainName?: string
  ) {
    if (hasSelectedNativeAssetForChain(assetInfo, sourceChainName))
      return +ethers.utils.formatUnits(
        await this.provider.getBalance(await this.getAddress()),
        assetInfo.decimals
      )
    return null
  }

  public async getBalance(
    assetInfo: AssetInfo,
    sourceChainName?: string
  ): Promise<number> {
    const checkNativeBalance = await this.getNativeAssetBalance(
      assetInfo,
      sourceChainName
    )
    if (checkNativeBalance) return checkNativeBalance

    const tokenContractAddress: string = await this.getOrFetchTokenAddress(
      assetInfo as AssetInfo
    )
    const signer = await this.getSigner().getAddress()
    const contract: Contract = this.getEthersContract(tokenContractAddress, erc20Abi)
    const decimals = await contract.decimals()
    const balance = (await contract.balanceOf(signer)).toString()
    return +ethers.utils.formatUnits(balance, decimals)
  }

  public async getOrFetchTokenAddress(assetInfo: AssetInfo): Promise<string> {
    const tokenSymbol: string = assetInfo.assetSymbol as string
    let tokenContract: string = ""

    if (this.tokenMap[tokenSymbol]) {
      tokenContract = this.tokenMap[tokenSymbol] as string
    } else {
      const endpoint = `/token-address?module=evm&chain=${this.chainName.toLowerCase()}&asset=${
        assetInfo.common_key
      }`
      try {
        const response = await axios.get(this.nodeServerUrl + endpoint)
        tokenContract = response.data.data
        this.tokenMap[tokenSymbol] = tokenContract
      } catch (error) {
        console.error(error)
      }
    }
    return tokenContract
  }

  public async transferTokens(
    _receiver: string,
    _amount: string | BigNumber,
    asset: AssetInfo
  ): Promise<MetamaskTransferEvent> {
    const tokenContractAddr: string = await this.getOrFetchTokenAddress(asset)
    const ethersContract = this.getEthersContract(tokenContractAddr, erc20Abi)
    const balance = await ethersContract.balanceOf(await this.getAddress())
    const { response, amount, receiver } = this.validateInputs(
      _receiver,
      _amount,
      asset,
      balance
    )

    const tx = await ethersContract.transfer(
      receiver,
      amount,
      createFeeTxOption(this.signer)
    )

    const receipt = await tx.wait()

    response.tokenContractAddress = tokenContractAddr
    response.txHash = tx.hash
    response.blockNumber = receipt.blockNumber

    return response
  }

  public async transferNativeTokens(
    _receiver: string,
    _amount: string | BigNumber,
    asset: AssetInfo,
    sourceChainName: string
  ): Promise<MetamaskTransferEvent> {
    const balance: BigNumber = await this.provider.getBalance(
      await this.getAddress()
    )
    const {
      response,
      amount: value,
      receiver,
    } = this.validateInputs(_receiver, _amount, asset, balance)

    const contractAddress: string =
      convertAndDepositContractAddress[
        process.env.REACT_APP_STAGE === "mainnet" ? "mainnet" : "testnet"
      ][sourceChainName?.toLowerCase() || ""]

    const tx = await this.getEthersContract(
      contractAddress,
      convertAndDepositAbi
    ).depositAndTransfer(receiver, { value })

    const receipt = await tx.wait()

    response.txHash = tx.hash
    response.blockNumber = receipt.blockNumber

    return response
  }

  private validateInputs(
    receiver: string,
    amount: string | BigNumber,
    asset: AssetInfo,
    balance: BigNumber
  ): {
    response: MetamaskTransferEvent
    amount: string | BigNumber
    receiver: string
  } {
    const response: MetamaskTransferEvent = {
      txHash: "",
      tokenContractAddress: "",
      receiver,
      amount: "",
      error: "",
      blockNumber: "",
    }

    /*validate input address*/
    try {
      receiver = ethers.utils.getAddress(receiver)
    } catch {
      response.error += `, Invalid address: ${receiver}, `
    }

    /*validate amounts are not malformed */
    try {
      amount = ethers.utils.parseUnits(amount as string, asset.decimals)
      if (amount.isNegative()) {
        throw new Error()
      }
    } catch (e) {
      console.error(`Invalid amount: ${amount}` + e)
      response.error += `, Invalid amount: ${amount}`
    }

    /*validate balance on wallet are greater than amount requested for transfer */
    if (balance.lt(amount)) {
      let amountFormatted = ethers.utils.formatUnits(amount, asset.decimals)
      let balanceFormatted = ethers.utils.formatUnits(balance, asset.decimals)
      console.error(
        `Insufficient balance receiver send ${amountFormatted} (You have ${balanceFormatted})`
      )
      response.error += `, Insufficient balance receiver send ${amountFormatted} (You have ${balanceFormatted})`
    }

    return { response, amount, receiver }
  }

  public confirmEtherTransaction(
    txHash: string,
    confirmations: number,
    confirmInterval: number,
    cb: any
  ) {
    setTimeout(async () => {
      const numConfirmations = (await this.provider.getTransaction(txHash))
        .confirmations
      cb({ numConfirmations })
      if (numConfirmations >= confirmations) return
      return this.confirmEtherTransaction(
        txHash,
        confirmations,
        confirmInterval,
        cb
      )
    }, confirmInterval * 1000)
  }

  private getEthersContract(tokenAddress: string, abi: any) {
    return new ethers.Contract(tokenAddress, abi, this.signer)
  }
}
