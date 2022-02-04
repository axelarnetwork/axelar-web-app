import {atom} from "recoil";
import {recoilPersist} from "recoil-persist";

const {persistAtom} = recoilPersist();

export const HasAcknowledgedTerraReinstall = atom<boolean>({
	key: "HasAcknowledgedTerraReinstall",
	default: false,
	effects_UNSTABLE: [persistAtom]
});