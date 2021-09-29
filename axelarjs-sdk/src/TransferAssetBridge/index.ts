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

export interface UnconfirmedTxRef {
	address: string;
	confirmations: number;
	double_spend: boolean;
	preference: string; //"low"
	received: string; //"2021-09-29T01:49:51.656Z"
	spent: boolean;
	tx_hash: string;
	tx_input_n: number;
	tx_output_n: number;
	value: number;
}
export interface TxRef {
	block_height: number;
	confirmations: number
	confirmed: string; //"2021-09-23T16:05:05Z"
	double_spend: boolean;
	ref_balance: number;
	spent: boolean;
	tx_hash: string;
	tx_input_n: number;
	tx_output_n: number;
	value: number;
}
export interface BlockCypherResponse {
	address: string;
	balance: number;
	final_balance: number;
	final_n_tx: number;
	n_tx: number;
	total_received: number;
	total_sent: number;
	tx_url: string;
	txrefs: TxRef[];
	unconfirmed_balance: 100000
	unconfirmed_n_tx: 1
	unconfirmed_txrefs: UnconfirmedTxRef[]
}
export type IBlockCypherResponse = (data: BlockCypherResponse) => any;
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

	public async transferAssets(message: IAssetTransferObject, waitCb: StatusResponse): Promise<IDepositAddressResponse> {
		const depositAddress: IDepositAddressResponse = await this.getDepositAddress(message);
		this.listenForTransactionStatus(depositAddress, waitCb);
		return depositAddress;
	}

	private async getDepositAddress(message: IAssetTransferObject): Promise<IDepositAddressResponse> {

		// post to rest API with parameters for link transaction
		// TODO: use websocketclient on rest-server to wait for deposit address
		return await this.clientRest.post(CLIENT_API_POST_TRANSFER_ASSET, message);
	}

	private listenForTransactionStatus(depositAddress: IDepositAddressResponse, waitCb: StatusResponse): void {
		const waitingService = getWaitingService("bitcoin");
		waitingService.wait(depositAddress, waitCb);
	}

}