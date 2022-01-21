import {atom} from "recoil";
import {recoilPersist} from "recoil-persist";

const {persistAtom} = recoilPersist();

export const HasTerraConnectedToKeplr = atom<boolean>({
	key: "HasTerraConnectedToKeplr",
	default: false,
	effects_UNSTABLE: [persistAtom]
});