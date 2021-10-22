import {WaitingService}       from "./WaitingService";
import {IAsset}               from "../../constants";
import {StatusResponse}       from "../index";
import {ClientSocketConnect}  from "../ClientSocketConnect";
import {ISocketListenerTypes} from "../../interface";

export default class TendermintService extends WaitingService {

	constructor(depositAddress: string) {
		super(1, depositAddress);
	}

	public async wait(depositAddress: IAsset, interimStatusCb: StatusResponse, clientSocketConnect: ClientSocketConnect) {

		await clientSocketConnect.connect();

		return await clientSocketConnect.emitMessageAndWaitForReply(
			ISocketListenerTypes.WAIT_FOR_AXL_DEPOSIT,
			depositAddress,
			ISocketListenerTypes.AXL_DEPOSIT_CONFIRMED,
			interimStatusCb
		);

	}
}