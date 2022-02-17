import { AXELAR_API } from "config/env"
import { ConfirmDepositRequest } from "interface/confirmDepositTypes"

// We don't actually use it in the api server because every signer will use the same axelar account to sign transaction.
const mockSignature =
  "0x11ee4e3ff6a5fbd800abc8fbceed54a75002c37ec9312a3c72b6171627b7842125ff38259fe8f00b4e9de5c60aa7ec0ec8bb820bef93408d5bd42c812e6750d21c"

export function confirmDeposit(req: ConfirmDepositRequest) {
  if (req.token === "uusd") {
    req.token =
      "ibc/6F4968A73F90CF7DE6394BF937D6DF7C7D162D74D839C13F53B41157D315E05F"
  } else if (req.token === " uluna") {
    req.token =
      "ibc/4627AD2524E3E0523047E35BB76CC90E37D9D57ACF14F0FCBCEB2480705F3CB8"
  }

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
