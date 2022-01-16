import {atom}          from "recoil";
import {recoilPersist} from "recoil-persist";
import {Nullable}      from "../interface/Nullable";

const {persistAtom} = recoilPersist();

export const IsLoggedIn = atom<boolean>({
	key: "IsLoggedIn",
	default: false,
	effects_UNSTABLE: [persistAtom]
});

export const DisclaimerAgreed = atom<boolean>({
	key: "DisclaimerAgreed",
	default: false,
	effects_UNSTABLE: [persistAtom]
});
export const ShowLargeDisclaimer = atom<boolean>({
	key: "ShowLargeDisclaimer",
	default: false,
});

export const DismissWalkThrough = atom<boolean>({
	key: "DismissWalkThrough",
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

export const ShowRecaptchaV2Retry = atom<boolean>({
	key: "ShowRecaptchaV2Retry",
	default: false,
});

