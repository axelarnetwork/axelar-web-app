import {atom}                                            from "recoil";
import {ChainList as ImportedChains, Chain, ChainInfo} from "@axelar-network/axelarjs-sdk";

const initialState: ChainInfo[] = ImportedChains.map((chain: Chain) => chain.chainInfo);

/*
list of supported chains as downloaded from the SDK
*/
export const ChainList = atom<ChainInfo[]>({
	key: "ChainList",
	default: initialState,
});