import {
  AssetInfoWithTrace,
  AssetTransferObject,
  CallbackStatus,
  TransferAssetBridge,
} from "@axelar-network/axelarjs-sdk"

export class TransferAssetBridgeFacade {
  private static environment: string
  private static transferAssetBridge: TransferAssetBridge

  constructor(environment: string) {
    TransferAssetBridgeFacade.environment = environment
    TransferAssetBridgeFacade.transferAssetBridge = new TransferAssetBridge(
      TransferAssetBridgeFacade.environment
    )
  }

  public static async transferAssets(
    message: AssetTransferObject,
    sourceCbs: CallbackStatus,
    destCbs: CallbackStatus
  ): Promise<AssetInfoWithTrace> {
    try {
      return TransferAssetBridgeFacade.transferAssetBridge.transferAssets(
        message,
        sourceCbs,
        destCbs,
        false
      )
    } catch (e: any) {
      sourceCbs?.failCb()
      // SendLogsToServer.error("TransferAssetBridgeFacade_FRONTEND_ERROR_1", JSON.stringify(e), "NO_UUID");
      throw e
    }
  }
}
