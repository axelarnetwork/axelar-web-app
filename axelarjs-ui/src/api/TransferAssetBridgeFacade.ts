import {IAssetTransferObject, TransferAssetBridge} from "@axelar-network/axelarjs-sdk";
import {AXELAR_BRIDGE_HOST_URL} from "../config";

export class TransferAssetBridgeFacade {

	private static hostUrl: string;
	private static transferAssetBridge: TransferAssetBridge;

	constructor(hostUrl?: string) {
		TransferAssetBridgeFacade.hostUrl = hostUrl || AXELAR_BRIDGE_HOST_URL;
		TransferAssetBridgeFacade.transferAssetBridge = new TransferAssetBridge(TransferAssetBridgeFacade.hostUrl);
	}

	public static transferAssets(message: IAssetTransferObject, waitCb: any): Promise<string> {
		return TransferAssetBridgeFacade.transferAssetBridge.transferAssets(message, waitCb);
	}

}