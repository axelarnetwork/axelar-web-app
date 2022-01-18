import {atomFamily} from "recoil";

export const METAMASK_WALLET: string = "MetamaskWallet";
export const KEPLR_WALLET: string = "KeplrWallet";

export const IsWalletConnected = atomFamily<boolean, string>({
	key: "IsWalletConnected",
	default: false,
});