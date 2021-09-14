import {IAssetTransferObject, TransferAssetBridge} from "@axelar-network/axelarjs-sdk";
import {AXELAR_BRIDGE_HOST_URL} from "../config";

export class TransferAssetBridgeFacade {

	private static hostUrl: string = AXELAR_BRIDGE_HOST_URL;
	private static transferAssetBridge: TransferAssetBridge;

	constructor(hostUrl?: string) {
		TransferAssetBridgeFacade.hostUrl = hostUrl || TransferAssetBridgeFacade.hostUrl;
		TransferAssetBridgeFacade.transferAssetBridge = new TransferAssetBridge(TransferAssetBridgeFacade.hostUrl);
	}

	public static transferAssets(message: IAssetTransferObject, waitCb: any): Promise<string> {
		return TransferAssetBridgeFacade.getTransferAssetBridge.transferAssets(message, waitCb);
	}

	public static get getTransferAssetBridge() {
		return TransferAssetBridgeFacade.transferAssetBridge;
	}

}