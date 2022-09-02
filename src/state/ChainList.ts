import { atom, selector } from "recoil"
import { ChainInfo, Environment, loadChains } from "@axelar-network/axelarjs-sdk"
import {
  ConfigsForEnvironment,
  EthersJsConfigs,
  getConfigs,
} from "api/WaitService/constants"
import { restrictedAccounts } from "config/restrictedAccounts"

const environment = process.env.REACT_APP_STAGE as Environment
const disabledChains = (process.env.REACT_APP_DISABLED_CHAINS as string) || ""

const filterInitialChainList = (inputChains: ChainInfo[]) => (inputChains)
  .filter(
    (chainInfo: ChainInfo) =>
      (environment === "mainnet" ? chainInfo.fullySupported : true) &&
      !!chainInfo?.assets?.length &&
      !disabledChains?.includes(chainInfo.chainName.toLowerCase())
  )
  .map((chainInfo: ChainInfo) => {
    const newChainInfo = {...chainInfo}

    if (newChainInfo?.chainSymbol?.toLowerCase() === "axelar") newChainInfo.assets = chainInfo.assets?.filter(asset => asset.common_key === "uaxl")

    newChainInfo.chainSymbol = chainInfo.chainSymbol.toUpperCase()
    newChainInfo.chainName = chainInfo.chainSymbol.charAt(0).toUpperCase() + chainInfo.chainSymbol.slice(1);

    return newChainInfo
  })

const getChains = async () => {
  const environment: Environment = process.env.REACT_APP_STAGE === "local"
  ? "testnet" as Environment
  : (process.env.REACT_APP_STAGE as Environment)
  return await loadChains({ environment })
}
export const allChainsState = selector<ChainInfo[]>({
  key: "allChains",
  get: async ({ get }) => {
    try {
      const response = filterInitialChainList(await getChains());
      return response || [];
    } catch (error) {
      console.error(`allChains -> getChains() ERROR: \n${error}`);
      return [];
    }
  }
});
let bannedAddresses: string[] = []

const { ethersJsConfigs } = getConfigs(environment) as ConfigsForEnvironment

for (const v of Object.values(ethersJsConfigs)) {
  const { tokenAddressMap } = v as EthersJsConfigs
  bannedAddresses = bannedAddresses.concat(Object.values(tokenAddressMap))
}
bannedAddresses = bannedAddresses.concat(restrictedAccounts)

/*
list of supported chains as downloaded from the SDK
*/
export const ChainList = atom<ChainInfo[]>({
  key: "ChainList",
  default: allChainsState,
})

export const BannedAddresses = atom<string[]>({
  key: "BannedAddresses",
  default: bannedAddresses,
})
