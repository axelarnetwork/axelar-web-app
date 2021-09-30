import {ClientSocketConnect}                                                            from "./ClientSocketConnect";
import {IAssetTransferObject}                                                           from "../interface/IAssetTransferObject";
import {CLIENT_API_POST_TRANSFER_ASSET, IBlockCypherResponse, IDepositAddressResponse,} from "../interface";
import {ClientRest}                                                                     from "./ClientRest";
import getWaitingService                                                                from "./status";

export type StatusResponse = IBlockCypherResponse
	| (() => void);

export class TransferAssetBridge {

	private clientSocketConnect: ClientSocketConnect;
	private clientRest: ClientRest;

	constructor(resourceUrl: string) {
		console.log("TransferAssetBridge initiated");
		this.clientSocketConnect = new ClientSocketConnect(resourceUrl);
		this.clientRest = new ClientRest(resourceUrl);
	}

	public async transferAssets(message: IAssetTransferObject, successCb: StatusResponse, errCb: any): Promise<IDepositAddressResponse> {
		const depositAddress: IDepositAddressResponse = await this.getDepositAddress(message);
		this.listenForTransactionStatus(depositAddress, successCb, errCb);
		return depositAddress;
	}

	private async getDepositAddress(message: IAssetTransferObject): Promise<IDepositAddressResponse> {
		return await this.clientRest.post(CLIENT_API_POST_TRANSFER_ASSET, message);
	}

	private async listenForTransactionStatus(depositAddress: IDepositAddressResponse, waitCb: StatusResponse, errCb: any) {
		const waitingService = getWaitingService("bitcoin");
		try {
			await waitingService.wait(depositAddress, waitCb);
		} catch (e) {
			errCb(e);
		}
	}

}