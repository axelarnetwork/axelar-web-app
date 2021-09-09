import {IAssetTransferObject, TRANSFER_RESULT} from "@axelar-network/axelarjs-sdk";

exports.btc2evm = async function (messageParam: IAssetTransferObject) {

	console.log("btc2evm messageParam",messageParam);

	const res = await confirmBtcDeposit();

	this.emit(TRANSFER_RESULT, res);
}

const confirmBtcDeposit = () => new Promise((res: any, rej: any) => setTimeout(() => {
	console.log("Done!");
	res("Done!")
}, 5000));