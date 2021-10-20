import {IAssetTransferObject, ITokenAddress, TransferAssetBridge} from "@axelar-network/axelarjs-sdk";

export class TransferAssetBridgeFacade {

	private static hostUrl: string;
	private static transferAssetBridge: TransferAssetBridge;

	constructor(hostUrl: string) {
		TransferAssetBridgeFacade.hostUrl = hostUrl;
		TransferAssetBridgeFacade.transferAssetBridge = new TransferAssetBridge(TransferAssetBridgeFacade.hostUrl);
	}

	public static async transferAssets(message: IAssetTransferObject, waitCb: any, errCb: any): Promise<ITokenAddress> {

		try {
			return TransferAssetBridgeFacade.transferAssetBridge.transferAssets(message, waitCb, errCb);
		} catch (e: any) {
			throw e;
		}
	}

}