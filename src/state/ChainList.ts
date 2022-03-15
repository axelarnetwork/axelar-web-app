import { atom } from "recoil"
import {
  Chain,
  ChainInfo,
  ChainList as ImportedChains,
  EnvironmentConfigs,
  EthersJsConfigs,
  getConfigs,
} from "@axelar-network/axelarjs-sdk"

const environment = process.env.REACT_APP_STAGE as string
const initialState: ChainInfo[] = ImportedChains
.filter((chain: Chain) =>
  environment === "mainnet" ? chain.chainInfo.fullySupported : true
)
.filter((chain: Chain) =>
  environment === "mainnet"
    ? true
    : chain?.chainInfo?.chainName?.toLowerCase() !== "fantom" // only temporary, given fantom RPC issues
)
.map((chain: Chain) => {
  // this is temporary given polygon RPC issues
  const newChainInfo = chain.chainInfo;
  if (newChainInfo?.chainName?.toLowerCase() === "polygon") {
    newChainInfo.confirmLevel = 225
    newChainInfo.estimatedWaitTime = 15
  }
  return newChainInfo
})

console.log("chians...",initialState)
let bannedAddresses: string[] = []; 

const { ethersJsConfigs } = getConfigs(environment) as EnvironmentConfigs;

for (const v of Object.values(ethersJsConfigs)) {
  const { tokenAddressMap } = v as EthersJsConfigs;
  bannedAddresses = bannedAddresses.concat(Object.values(tokenAddressMap))
}

/*
list of supported chains as downloaded from the SDK
*/
export const ChainList = atom<ChainInfo[]>({
  key: "ChainList",
  default: initialState,
})

export const BannedAddresses = atom<string[]>({
  key: "BannedAddresses",
  default: bannedAddresses
})