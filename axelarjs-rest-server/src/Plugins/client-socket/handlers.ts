import {IAsset, ISocketListenerTypes, TRANSFER_RESULT} from "@axelar-network/axelarjs-sdk";
import DepositConfirmationListener                     from "../../services/TendermintWebsocket/DepositConfirmationListener";

exports.listenForAXLDeposit = async function (messageParam: IAsset) {

	console.log("listenForAXLDeposit messageParam", messageParam);
	const assetAddress: any = await new DepositConfirmationListener().listen(messageParam.assetAddress as string);
	this.emit(ISocketListenerTypes.AXL_DEPOSIT_CONFIRMED, assetAddress);

}