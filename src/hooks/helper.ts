import { Nullable } from "../interface/Nullable"

export const depositConfirmCbMap: {
  [chainSymbol: string]: (param: any) => Nullable<number>
} = {}

depositConfirmCbMap.btc = (status: any): Nullable<number> => {
  console.log("status+++++", status)

  let numberConfirmations: Nullable<number> = null

  if (status.unconfirmed_txrefs) numberConfirmations = null
  else if (status?.txrefs?.length)
    numberConfirmations = status.txrefs[0].confirmations

  return numberConfirmations
}

depositConfirmCbMap.cos = (status: any): Nullable<number> => {
  return 1
}

depositConfirmCbMap.eth = (status: any): Nullable<number> => {
  return 1
}

depositConfirmCbMap.axl = (status: any): Nullable<number> => {
  return 1
}

depositConfirmCbMap.terra = (status: any): Nullable<number> => {
  return 1
}
