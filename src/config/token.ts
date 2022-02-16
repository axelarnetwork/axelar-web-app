export function getTokenDenomForAxelarChain(token: string) {
  if (token === "uluna") {
    return "ibc/4627AD2524E3E0523047E35BB76CC90E37D9D57ACF14F0FCBCEB2480705F3CB8"
  } else if (token === "uusd") {
    return "ibc/6F4968A73F90CF7DE6394BF937D6DF7C7D162D74D839C13F53B41157D315E05F"
  } else {
    return "uaxl"
  }
}
