import {atom, atomFamily}       from "recoil";
import {IAssetInfo, IChainInfo} from "@axelar-network/axelarjs-sdk";
import {Nullable}               from "interface/Nullable";

/*
tracks selections for source and destination chain selections, noted by
const SOURCE_TOKEN_KEY: string = "first-chain-selection";
const DESTINATION_TOKEN_KEY: string = "second-chain-selection";
*/
export const ChainSelection = atomFamily<Nullable<IChainInfo>, string>({
	key: "ChainSelection",
	default: null,
});

/*
tracks selection of the source asset to be transferred to the destination chain
*/
export const SourceAsset = atom<Nullable<IAssetInfo>>({
	key: "SourceAsset",
	default: null,
});

/*
tracks selection of the user's inputted address on the destination chain where the asset
is to be transferred
*/
export const DestinationAddress = atom<Nullable<string>>({
	key: "DestinationAddress",
	default: null,
});

/*
used to regex validate the inputted destination address
* */
export const IsValidDestinationAddress = atom<boolean>({
	key: "IsValidDestinationAddress",
	default: false,
});