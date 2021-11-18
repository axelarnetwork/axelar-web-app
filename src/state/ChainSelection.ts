import {atom, atomFamily}       from "recoil";
import {IAssetInfo, IChainInfo} from "@axelar-network/axelarjs-sdk";
import {Nullable}               from "interface/Nullable";

export const ChainSelection = atomFamily<Nullable<IChainInfo>, string>({
	key: "ChainSelection",
	default: null,
});

export const SourceAsset = atom<Nullable<IAssetInfo>>({
	key: "SourceAsset",
	default: null,
});

export const DestinationAddress = atom<Nullable<string>>({
	key: "DestinationAddress",
	default: null,
});

export const IsValidDestinationAddress = atom<boolean>({
	key: "IsValidDestinationAddress",
	default: false,
});