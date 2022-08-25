import { StargateClient, DeliverTxResponse } from "@cosmjs/stargate"
import { fromBase64 } from "@cosmjs/encoding"
import { AXELAR_RPC } from "config/env"

export async function broadcastCosmosTx(
  base64Tx: string
): Promise<DeliverTxResponse> {
  const txBytes = fromBase64(base64Tx)
  const cosmjs = await StargateClient.connect(AXELAR_RPC)
  return cosmjs.broadcastTx(txBytes)
}
