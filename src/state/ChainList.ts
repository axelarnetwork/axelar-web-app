import { atom, selector } from "recoil"
import { ChainInfo, Environment, loadChains } from "@axelar-network/axelarjs-sdk"
import {
  ConfigsForEnvironment,
  EthersJsConfigs,
  getConfigs,
} from "api/WaitService/constants"

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
    // this is temporary given polygon RPC issues
    const newChainInfo = {...chainInfo}
    newChainInfo.chainSymbol = chainInfo.chainSymbol.toUpperCase()
    newChainInfo.chainName = chainInfo.chainSymbol.charAt(0).toUpperCase() + chainInfo.chainSymbol.slice(1);
    if (newChainInfo?.chainName?.toLowerCase() === "polygon") {
      newChainInfo.confirmLevel = 225
      newChainInfo.estimatedWaitTime = 15
    }
    if (newChainInfo?.chainName?.toLowerCase() === "binance") { //temporary override
      newChainInfo.confirmLevel = 15
    }
    return newChainInfo
  })

const getChains = async () => {
  const environment: Environment = process.env.REACT_APP_STAGE === "local"
  ? "testnet" as Environment
  : (process.env.REACT_APP_STAGE as Environment)
  return await loadChains({ environment })
  // ALL_CHAINS = chains;
}
export const allChainsState = selector<ChainInfo[]>({
  key: "allChains",
  get: async ({ get }) => {
    try {
      const response = filterInitialChainList(await getChains());
      // console.log("getUsers called...");
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
