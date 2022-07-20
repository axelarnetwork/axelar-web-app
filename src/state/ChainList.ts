import { atom } from "recoil"
import { Chain, ChainInfo, Environment, loadChains } from "@axelar-network/axelarjs-sdk"
import {
  ConfigsForEnvironment,
  EthersJsConfigs,
  getConfigs,
} from "api/WaitService/constants"

const environment = process.env.REACT_APP_STAGE as Environment
const disabledChains = (process.env.REACT_APP_DISABLED_CHAINS as string) || ""

const initialChainList: ChainInfo[] = loadChains({ environment })
  .filter(
    (chain: Chain) =>
      (environment === "mainnet" ? chain.chainInfo.fullySupported : true) &&
      !!chain?.chainInfo?.assets?.length &&
      !disabledChains?.includes(chain.chainInfo.chainName.toLowerCase())
  )
  .map((chain: Chain) => {
    // this is temporary given polygon RPC issues
    const newChainInfo = chain.chainInfo
    if (newChainInfo?.chainName?.toLowerCase() === "polygon") {
      newChainInfo.confirmLevel = 225
      newChainInfo.estimatedWaitTime = 15
    }
    return newChainInfo
  })

let bannedAddresses: string[] = []

const { ethersJsConfigs } = getConfigs(environment) as ConfigsForEnvironment

for (const v of Object.values(ethersJsConfigs)) {
  const { tokenAddressMap } = v as EthersJsConfigs
  bannedAddresses = bannedAddresses.concat(Object.values(tokenAddressMap))
}

/*
list of supported chains as downloaded from the SDK
*/
export const ChainList = atom<ChainInfo[]>({
  key: "ChainList",
  default: initialChainList,
})

export const BannedAddresses = atom<string[]>({
  key: "BannedAddresses",
  default: bannedAddresses,
})
