import {atom}                                          from "recoil";
import {Chain, ChainInfo, ChainList as ImportedChains} from "@axelar-network/axelarjs-sdk";

const environment = process.env.REACT_APP_STAGE as string;
const initialState: ChainInfo[] = ImportedChains
.filter((chain: Chain) => environment === "mainnet" ? chain.chainInfo.fullySupported : true)
.map((chain: Chain) => chain.chainInfo);

/*
list of supported chains as downloaded from the SDK
*/
export const ChainList = atom<ChainInfo[]>({
	key: "ChainList",
	default: initialState,
});