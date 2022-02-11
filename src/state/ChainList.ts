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
const initialState: ChainInfo[] = ImportedChains.filter((chain: Chain) =>
  environment === "mainnet" ? chain.chainInfo.fullySupported : true
).map((chain: Chain) => chain.chainInfo)

let bannedAddresses: string[] = []; 

const { ethersJsConfigs } = getConfigs(environment) as EnvironmentConfigs;

for (const [k,v] of Object.entries(ethersJsConfigs)) {
  const { tokenAddressMap } = v as EthersJsConfigs;
  bannedAddresses = bannedAddresses.concat(Object.values(tokenAddressMap))
}

console.log("banned addresses",bannedAddresses);
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