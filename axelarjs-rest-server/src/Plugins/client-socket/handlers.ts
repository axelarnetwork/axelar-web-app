import {IAssetInfo, ISocketListenerTypes} from "@axelar-network/axelarjs-sdk";
import DepositConfirmationListener        from "../../Services/TendermintWebsocket/DepositConfirmationListener";

exports.listenForAXLDeposit = async function (messageParam: IAssetInfo) {

	const query: any = {
		'transfer.recipient': messageParam.assetAddress as string,
	}

	const depositConfirmation: any = await new DepositConfirmationListener().listen(query);

	console.log("asset deposit confirmed confirmed", depositConfirmation);
	this.emit(ISocketListenerTypes.AXL_DEPOSIT_CONFIRMED, depositConfirmation);

}

exports.listenForETHDeposit = async function (messageParam: IAssetInfo) {

	const query: any = {
		'depositConfirmation.module': "evm",
		'depositConfirmation.burnAddress': messageParam.assetAddress
	}

	const depositConfirmation: any = await new DepositConfirmationListener().listen(query);

	console.log("asset deposit confirmed on EVM", depositConfirmation);
	this.emit(ISocketListenerTypes.EVM_DEPOSIT_CONFIRMED, depositConfirmation);

}