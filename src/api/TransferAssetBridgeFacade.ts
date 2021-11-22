import {
	IAssetInfoWithTrace,
	IAssetTransferObject,
	ICallbackStatus,
	TransferAssetBridge
} from "@axelar-network/axelarjs-sdk";

export class TransferAssetBridgeFacade {

	private static environment: string;
	private static transferAssetBridge: TransferAssetBridge;

	constructor(environment: string) {
		TransferAssetBridgeFacade.environment = environment;
		TransferAssetBridgeFacade.transferAssetBridge = new TransferAssetBridge(TransferAssetBridgeFacade.environment);
	}

	public static async transferAssets(message: IAssetTransferObject, sourceCbs: ICallbackStatus, destCbs: ICallbackStatus): Promise<IAssetInfoWithTrace> {

		try {
			return TransferAssetBridgeFacade.transferAssetBridge.transferAssets(message, sourceCbs, destCbs, false);
		} catch (e: any) {
			sourceCbs?.failCb();
			throw e;
		}
	}

}