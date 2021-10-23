import {IAsset, ISocketListenerTypes, TRANSFER_RESULT} from "@axelar-network/axelarjs-sdk";
import DepositConfirmationListener                     from "../../services/TendermintWebsocket/DepositConfirmationListener";

exports.listenForAXLDeposit = async function (messageParam: IAsset) {

	const depositConfirmation: any = await new DepositConfirmationListener().listen(messageParam.assetAddress as string);

	console.log("asset deposit confirmed confirmed", depositConfirmation);
	this.emit(ISocketListenerTypes.AXL_DEPOSIT_CONFIRMED, depositConfirmation);

}