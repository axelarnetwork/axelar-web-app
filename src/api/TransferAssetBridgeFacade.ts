import {
  AxelarAssetTransfer,
  Environment
} from "@axelar-network/axelarjs-sdk"

export class TransferAssetBridgeFacade {
  private static environment: string
  private static transferAssetBridge: AxelarAssetTransfer

  constructor(environment: string) {
    TransferAssetBridgeFacade.environment = environment
    TransferAssetBridgeFacade.transferAssetBridge = new AxelarAssetTransfer(
      { environment: Environment[process.env.REACT_APP_STAGE?.toUpperCase() as keyof typeof Environment] }
    )
  }

  public static async getDepositAddress(
    fromChain: string,
    toChain: string,
    destinationAddress: string,
    asset: string,
    options?: {
      _traceId: string;
    }
  ): Promise<string> {
    try {
      return TransferAssetBridgeFacade.transferAssetBridge.getDepositAddress(fromChain, toChain, destinationAddress, asset, options)
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
    return null; //TODO
  }

  public static async getTxFee(
    srcChain: string,
    destChain: string,
    asset: string
  ) {
    // return await TransferAssetBridgeFacade.transferAssetBridge.getTransferFee(srcChain, destChain, asset)
  }
}
