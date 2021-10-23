
import {IAssetTransferObject}                                 from "../interface/IAssetTransferObject";
import {CLIENT_API_POST_TRANSFER_ASSET, IBlockCypherResponse} from "../interface";
import {ClientRest}                                           from "./ClientRest";
import getWaitingService             from "./status";
import {IAsset, ISupportedChainType} from "../constants";
import {ClientSocketConnect}         from "./ClientSocketConnect";
import {validateDestinationAddress}                                           from "../utils";


export type StatusResponse = IBlockCypherResponse
	| (() => void);

export class TransferAssetBridge {

	private clientRest: ClientRest;
	private clientSocketConnect: ClientSocketConnect;

	constructor(resourceUrl: string) {
		console.log("TransferAssetBridge initiated");
		this.clientRest = new ClientRest(resourceUrl);
		this.clientSocketConnect = new ClientSocketConnect(resourceUrl);
		// this.clientSocketConnect.connect();

	}

	public async transferAssets(message: IAssetTransferObject, successCb: StatusResponse, errCb: any): Promise<IAsset> {

		if (!validateDestinationAddress(message?.selectedDestinationAsset))
			throw new Error(`invalid destination address in ${message?.selectedDestinationAsset?.assetSymbol}`);

		const depositAddress: IAsset = await this.getDepositAddress(message);

		this.listenForTransactionStatus(depositAddress, message.sourceChainInfo, successCb, errCb).then(() => {
			this.listenForTransactionStatus(message.selectedDestinationAsset as IAsset, message.destinationChainInfo, successCb, errCb);
		})

		return depositAddress;
	}

	private async getDepositAddress(message: IAssetTransferObject): Promise<IAsset> {
		return await this.clientRest.post(CLIENT_API_POST_TRANSFER_ASSET, message);
	}

	private async listenForTransactionStatus(addressInformation: IAsset, chainInfo: ISupportedChainType, waitCb: StatusResponse, errCb: any) {
		const waitingService = chainInfo?.chainSymbol && getWaitingService(chainInfo.chainSymbol, chainInfo, addressInformation);
		try {
			await waitingService.wait(addressInformation, waitCb, this.clientSocketConnect);
		} catch (e) {
			errCb(e);
		}
	}

}