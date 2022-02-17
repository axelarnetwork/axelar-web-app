import { BigNumberish } from "ethers"

export interface ConfirmDepositRequest {
  hash: string
  from: string
  depositAddress: string
  amount: string
  signature?: string
  token?: string
}

export interface ConfirmDepositResponse {
  hash: string
  chain: string
  amount: BigNumberish
  depositTxHash: string
  depositAddress: string
  depositToken: string
  height: number
}
