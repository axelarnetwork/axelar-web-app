import {ClientSocketConnect}  from "./ClientSocketConnect";
import {IAssetTransferObject} from "../interface/IAssetTransferObject";
import {
	CLIENT_API_POST_TRANSFER_ASSET,
	IDepositAddressResponse,
	TRANSFER_RESULT,
	TransferAssetTypes
}                             from "../interface";
import {ClientRest}           from "./ClientRest";
import getWaitingService      from "./status";

export class TransferAssetBridge {

	private clientSocketConnect: ClientSocketConnect;
	private clientRest: ClientRest;

	constructor(resourceUrl: string) {
		console.log("TransferAssetBridge initiated");
		this.clientSocketConnect = new ClientSocketConnect(resourceUrl);
		this.clientRest = new ClientRest(resourceUrl);
	}

	public async transferAssets(message: IAssetTransferObject, waitCb: any): Promise<IDepositAddressResponse> {
		this.listenForTransactionStatus(TransferAssetTypes.BTC_TO_EVM, message, waitCb);
		return this.getDepositAddress(message);
	}

	private async getDepositAddress(message: IAssetTransferObject): Promise<IDepositAddressResponse> {

		// post to rest API with parameters for link transaction
		// TODO: use websocketclient on rest-server to wait for deposit address
		return await this.clientRest.post(CLIENT_API_POST_TRANSFER_ASSET, message);
	}

	private listenForTransactionStatus(topic: TransferAssetTypes, message: IAssetTransferObject, waitCb: any): void {
		const waitingService = getWaitingService("bitcoin");
		waitingService.wait();
		// this.clientSocketConnect.emitMessageAndWaitForReply(topic, {message}, TRANSFER_RESULT, waitCb)
	}

}