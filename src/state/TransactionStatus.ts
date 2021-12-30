import {atom, atomFamily} from "recoil";
import {Nullable}         from "../interface/Nullable";
import {IAssetInfo}       from "@axelar-network/axelarjs-sdk";

/*
tracker for the deposit address that is generated by the API
after the user triggers a transfer, i.e. the burner address
where users have to deposit their funds on the source chain as the first
step of the transfer event
*/
export const SourceDepositAddress = atom<Nullable<IAssetInfo>>({
	key: "SourceDepositAddress",
	default: null,
});

/*
the "trace ID" is a randomly generated uuid to help track specific
transactions initiated on the UI. for the moment, only used on the UI side.
* */
export const TransactionTraceId = atom<string>({
	key: "TransactionTraceId",
	default: "",
});

/*
TODO: NumberConfirmations is (potentially) deprecated
It had been used to follow the number of confirmations
on probabilistic chains for a transaction before getting
to the threshold we needed
* */
export interface IConfirmationStatus {
	numberConfirmations: Nullable<number>;
	numberRequiredConfirmations: Nullable<number>;
	transactionHash: Nullable<string>;
	amountConfirmedString: Nullable<string>;
}

export const NumberConfirmations = atomFamily<IConfirmationStatus, string>({
	key: "NumberConfirmations",
	default: {
		numberConfirmations: null,
		numberRequiredConfirmations: null,
		transactionHash: null,
		amountConfirmedString: null
	},
});

export const IsRecaptchaAuthenticated = atom<boolean>({
	key: "IsRecaptchaAuthenticated",
	default: true,
});

export const ActiveStep = atom<number>({
	key: "ActiveStep",
	default: 0,
});