import {atom}       from "recoil";
import { recoilPersist } from "recoil-persist";

const { persistAtom } = recoilPersist();

export const IsLoggedIn = atom<boolean>({
	key: "IsLoggedIn",
	default: false,
	effects_UNSTABLE: [persistAtom]
});