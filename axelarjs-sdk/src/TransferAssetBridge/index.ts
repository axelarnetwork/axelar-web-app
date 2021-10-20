import {IAssetTransferObject}                                 from "../interface/IAssetTransferObject";
import {CLIENT_API_POST_TRANSFER_ASSET, IBlockCypherResponse} from "../interface";
import {ClientRest}                                           from "./ClientRest";
import getWaitingService                                      from "./status";
import {IAsset}                                               from "../constants";

export type StatusResponse = IBlockCypherResponse
	| (() => void);

export class TransferAssetBridge {

	private clientRest: ClientRest;

	constructor(resourceUrl: string) {
		console.log("TransferAssetBridge initiated");
		this.clientRest = new ClientRest(resourceUrl);
	}

	public async transferAssets(message: IAssetTransferObject, successCb: StatusResponse, errCb: any): Promise<IAsset> {
		const depositAddress: IAsset = await this.getDepositAddress(message);
		this.listenForTransactionStatus(depositAddress, successCb, errCb).then(() => {
			this.listenForTransactionStatus(message.selectedDestinationAsset as IAsset, successCb, errCb);
		})

		return depositAddress;
	}

	private async getDepositAddress(message: IAssetTransferObject): Promise<IAsset> {
		return await this.clientRest.post(CLIENT_API_POST_TRANSFER_ASSET, message);
	}

	private async listenForTransactionStatus(addressInformation: IAsset, waitCb: StatusResponse, errCb: any) {
		const waitingService = addressInformation?.assetSymbol && getWaitingService(addressInformation.assetSymbol);
		try {
			await waitingService.wait(addressInformation, waitCb);
		} catch (e) {
			errCb(e);
		}
	}

}