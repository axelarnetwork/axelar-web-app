import {IAssetInfo, ISocketListenerTypes} from "@axelar-network/axelarjs-sdk";
import DepositConfirmationListener        from "../../Services/TendermintWebsocket/DepositConfirmationListener";

exports.listenForAXLDeposit = async function (messageParam: IAssetInfo) {

	const depositConfirmation: any = await new DepositConfirmationListener().listen(messageParam.assetAddress as string);

	console.log("asset deposit confirmed confirmed", depositConfirmation);
	this.emit(ISocketListenerTypes.AXL_DEPOSIT_CONFIRMED, depositConfirmation);

}