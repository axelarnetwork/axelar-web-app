import {atom, atomFamily}            from "recoil";
import {IAsset, ISupportedChainType} from "@axelar-network/axelarjs-sdk";
import {Nullable}                    from "interface/Nullable";

export const SOURCE_TOKEN_KEY: string       = "first-chain-selection";
export const DESTINATION_TOKEN_KEY: string  = "second-chain-selection";

export const ChainSelection = atomFamily<Nullable<ISupportedChainType>, string>({
	key: "ChainSelection",
	default: null,
});

export const SourceAsset = atom<Nullable<IAsset>>({
	key: "SourceAsset",
	default: null,
});

export const DestinationAddress = atom<Nullable<string>>({
	key: "DestinationAddress",
	default: null,
});