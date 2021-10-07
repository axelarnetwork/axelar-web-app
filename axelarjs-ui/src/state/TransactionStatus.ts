import {atom}                    from "recoil";
import {Nullable}                from "../interface/Nullable";
import {ITokenAddress} from "@axelar-network/axelarjs-sdk";

export const SourceDepositAddress = atom<Nullable<ITokenAddress>>({
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