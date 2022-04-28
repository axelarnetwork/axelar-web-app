import { atom } from "recoil"
import { recoilPersist } from "recoil-persist"

const { persistAtom } = recoilPersist()

export const HasAcknowledgedTerraReinstall = atom<boolean>({
  key: "HasAcknowledgedTerraReinstall",
  default: false,
  effects_UNSTABLE: [persistAtom],
})

export enum WalletType {
  METAMASK = "metamask",
  KEPLR = "keplr",
  TERRA = "terra",
}

export const SelectedWallet = atom<WalletType>({
  key: "SelectedWallet",
  default: WalletType.KEPLR,
})

export const IsKeplrWalletConnected = atom<boolean>({
  key: "IsKeplrWalletConnected",
  default: false,
  effects_UNSTABLE: [persistAtom],
})