
import { AssetInfo } from "@axelar-network/axelarjs-sdk"
import { ChainInfo } from "@axelar-network/axelarjs-sdk"
import { buildTransferCompletedRoomId } from "api/AxelarEventListener"
import { SocketService } from "api/WaitService/SocketService"
import { getConfigs } from "./constants"
import EthersJsWaitingService from "./EthersJsWaitingService"

export const transferEvent = async (
  chainInfo: ChainInfo,
  assetInfo: AssetInfo,
  address: string
) => {
  const { module } = chainInfo
  const env: string = process.env.REACT_APP_STAGE as string

  if (module === "axelarnet") {
    const roomId = await buildTransferCompletedRoomId(
      address,
      assetInfo?.common_key as string
    )
    return await new SocketService(
      getConfigs(env).resourceUrl
    ).joinRoomAndWaitForEvent(roomId)

  } else if (module === "evm") {

    const ethersJsListener = EthersJsWaitingService.build(chainInfo, assetInfo.common_key as string, address)
    return (await ethersJsListener).wait()
  }

}
