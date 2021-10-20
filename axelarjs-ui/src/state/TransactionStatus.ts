import {atom}          from "recoil";
import {Nullable} from "../interface/Nullable";
import {IAsset}   from "@axelar-network/axelarjs-sdk";

export const SourceDepositAddress = atom<Nullable<IAsset>>({
	key: "SourceDepositAddress",
	default: null,
});

export interface IConfirmationStatus {
	numberConfirmations: Nullable<number>;
	numberRequiredConfirmations: Nullable<number>;
}

export const NumberConfirmations = atom<IConfirmationStatus>({
	key: "NumberConfirmations",
	default: {
		numberConfirmations: null,
		numberRequiredConfirmations: null
	},
});

export const IsRecaptchaAuthenticated = atom<boolean>({
	key: "IsRecaptchaAuthenticated",
	default: true,
});