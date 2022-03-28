import {
  AssetInfoWithTrace,
  AssetTransferObject,
  CallbackStatus,
  GetDepositAddressDto,
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

  public static async getDepositAddress(
    dto: GetDepositAddressDto
  ): Promise<string> {
    try {
      return TransferAssetBridgeFacade.transferAssetBridge.getDepositAddress(dto)
    } catch (e: any) {
      // sourceCbs?.failCb()
      // SendLogsToServer.error("TransferAssetBridgeFacade_FRONTEND_ERROR_1", JSON.stringify(e), "NO_UUID");
      throw e
    }
  }

  public static async getFeeForChainAndAsset(
    chain: string,
    asset: string
  ): Promise<any> {
    try {
      return await TransferAssetBridgeFacade.transferAssetBridge.getFeeForChainAndAsset(
        chain,
        asset
      )
    } catch (e: any) {
      console.log("eee in facade", e)
      throw e
    }
  }

  public static async getTxFee(
    srcChain: string,
    destChain: string,
    asset: string
  ) {
    // return await TransferAssetBridgeFacade.transferAssetBridge.getTransferFee(srcChain, destChain, asset)
  }
}
