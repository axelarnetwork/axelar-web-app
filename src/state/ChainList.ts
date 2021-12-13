import {atom}                                            from "recoil";
import {ChainList as ImportedChains, IChain, IChainInfo} from "@axelar-network/axelarjs-sdk";

const initialState: IChainInfo[] = ImportedChains.map((chain: IChain) => chain.chainInfo);

/*
list of supported chains as downloaded from the SDK
*/
export const ChainList = atom<IChainInfo[]>({
	key: "ChainList",
	default: initialState,
});