import {atom, atomFamily} from "recoil";
import {recoilPersist}    from "recoil-persist";

const {persistAtom} = recoilPersist();

export const METAMASK_WALLET: string = "MetamaskWallet";
export const KEPLR_WALLET: string = "KeplrWallet";

export const HasTerraConnectedToKeplr = atom<boolean>({
	key: "HasTerraConnectedToKeplr",
	default: false,
	effects_UNSTABLE: [persistAtom]
});

export const HasAlreadyConnectedWallet = atomFamily<boolean, string>({
	key: "HasAlreadyConnectedWallet",
	default: false,
	effects_UNSTABLE: [persistAtom]
});