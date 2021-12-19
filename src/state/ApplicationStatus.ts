import {atom}          from "recoil";
import {recoilPersist} from "recoil-persist";
import {Nullable}      from "../interface/Nullable";

const {persistAtom} = recoilPersist();

export const IsLoggedIn = atom<boolean>({
	key: "IsLoggedIn",
	default: false,
	effects_UNSTABLE: [persistAtom]
});

export const ShowHelperCartoonWidget = atom<boolean>({
	key: "ShowHelperCartoonWidget",
	default: false,
});

export const MessageShownInCartoon = atom<Nullable<any>>({
	key: "MessageShownInCartoon",
	default: null
});

export const ShowTransactionStatusWindow = atom<boolean>({
	key: "ShowTransactionStatusWindow",
	default: false,
});