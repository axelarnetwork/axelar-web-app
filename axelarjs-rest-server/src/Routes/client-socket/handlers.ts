import {IAssetTransferObject, TRANSFER_RESULT} from "@axelar-network/axelarjs-sdk";

exports.hello = function () {

	this.emit("hello-back",'Hey there');
};

exports.newMessage = function (messageParam: string) {

	console.log('Got messageParam', messageParam);
};

exports.btc2evm = async function (messageParam: IAssetTransferObject) {

	console.log("messageParam",messageParam);

	const res = await confirmBtcDeposit();

	this.emit(TRANSFER_RESULT, res);
}

const confirmBtcDeposit = () => new Promise((res: any, rej: any) => setTimeout(() => {
	console.log("Done!");
	res("Done!")
}, 5000));