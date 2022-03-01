import { AXELAR_API } from "config/env"
import { getTokenDenomForAxelarChain } from "config/token"
import { ConfirmDepositRequest } from "interface/confirmDepositTypes"

// We don't actually use it in the api server because every signer will use the same axelar account to sign transaction.
const mockSignature =
  "0x11ee4e3ff6a5fbd800abc8fbceed54a75002c37ec9312a3c72b6171627b7842125ff38259fe8f00b4e9de5c60aa7ec0ec8bb820bef93408d5bd42c812e6750d21c"

export function confirmDeposit(req: ConfirmDepositRequest) {
  req.token = getTokenDenomForAxelarChain(req.token)
  req.signature = req.signature || mockSignature
  return fetch(AXELAR_API + "/confirm_deposit_tx", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(req),
  })
    .then((res) => res.json())
    .then((res) => res.data.base64Tx)
}
