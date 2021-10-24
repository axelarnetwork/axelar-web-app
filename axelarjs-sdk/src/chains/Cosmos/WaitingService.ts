import {IAsset, ISupportedChainType} from "../../constants";

import {ISocketListenerTypes, StatusResponse}              from "../../interface";
import {BaseWaitingService}                                from "../models/BaseWaitingService";
import {IAssetInfo, IBlockchainWaitingService, IChainInfo} from "../models/Chains";
import {ClientSocketConnect}                               from "../../TransferAssetBridge/ClientSocketConnect";

export default class WaitingService extends BaseWaitingService implements IBlockchainWaitingService {

	constructor(chainInfo: ISupportedChainType, assetInfo: IAsset) {
		super(1, assetInfo.assetAddress as string);
	}

	public async wait(depositAddress: IAsset, interimStatusCb: StatusResponse, clientSocketConnect: ClientSocketConnect) {

		await clientSocketConnect.connect();

		const data: any = await clientSocketConnect.emitMessageAndWaitForReply(
			ISocketListenerTypes.WAIT_FOR_AXL_DEPOSIT,
			depositAddress,
			ISocketListenerTypes.AXL_DEPOSIT_CONFIRMED,
			((data: any) => {
				data.axelarRequiredNumConfirmations = this.numConfirmations;
				interimStatusCb(data);
			}).bind(this)
		);
		return data;

	}
}