import {atom} from "recoil";


export const ShowFAQWidget = atom<boolean>({
	key: "ShowFAQWidget",
	default: false,
});

export const ShowGettingStartedWidget = atom<boolean>({
	key: "ShowGettingStartedWidget",
	default: false,
});