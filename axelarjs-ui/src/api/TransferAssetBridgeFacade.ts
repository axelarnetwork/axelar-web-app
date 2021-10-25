import {IAssetInfo, IAssetTransferObject, ICallbackStatus, TransferAssetBridge} from "@axelar-network/axelarjs-sdk";

export class TransferAssetBridgeFacade {

	private static hostUrl: string;
	private static transferAssetBridge: TransferAssetBridge;

	constructor(hostUrl: string) {
		TransferAssetBridgeFacade.hostUrl = hostUrl;
		TransferAssetBridgeFacade.transferAssetBridge = new TransferAssetBridge(TransferAssetBridgeFacade.hostUrl);
	}

	public static async transferAssets(message: IAssetTransferObject, sourceCbs: ICallbackStatus, destCbs: ICallbackStatus): Promise<IAssetInfo> {

		try {
			return TransferAssetBridgeFacade.transferAssetBridge.transferAssets(message, sourceCbs, destCbs);
		} catch (e: any) {
			sourceCbs?.failCb();
			throw e;
		}
	}

}