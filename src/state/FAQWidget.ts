import { atom } from "recoil"

export const ShowSupportWidget = atom<boolean>({
  key: "ShowSupportWidget",
  default: false,
})

export const ShowGettingStartedWidget = atom<boolean>({
  key: "ShowGettingStartedWidget",
  default: false,
})

export const ShowFAQ = atom<boolean>({
  key: "ShowFAQ",
  default: false,
})
