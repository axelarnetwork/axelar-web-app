import {atom, atomFamily} from "recoil";
import {Nullable}         from "../interface/Nullable";
import {IAssetInfo}       from "@axelar-network/axelarjs-sdk";

export const SourceDepositAddress = atom<Nullable<IAssetInfo>>({
	key: "SourceDepositAddress",
	default: null,
});

export interface IConfirmationStatus {
	numberConfirmations: Nullable<number>;
	numberRequiredConfirmations: Nullable<number>;
	transactionHash: Nullable<string>;
}

export const NumberConfirmations = atomFamily<IConfirmationStatus, string>({
	key: "NumberConfirmations",
	default: {
		numberConfirmations: null,
		numberRequiredConfirmations: null,
		transactionHash: null
	},
});

export const IsRecaptchaAuthenticated = atom<boolean>({
	key: "IsRecaptchaAuthenticated",
	default: true,
});