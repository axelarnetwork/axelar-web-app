import {IAssetTransferObject, TRANSFER_RESULT} from "@axelar-network/axelarjs-sdk";

// TODO: this is a mock implementation for now
exports.btc2evm = async function (messageParam: IAssetTransferObject) {

	console.log("btc2evm messageParam",messageParam);

	let done: string = "still waiting";

	const interval = setInterval(() => {
		this.emit(TRANSFER_RESULT, done);
	}, 1000);

	done = await confirmBtcDeposit();

	clearInterval(interval);

	this.emit(TRANSFER_RESULT, done);
}

const confirmBtcDeposit = (): Promise<string> => {
	return new Promise((res: any, rej: any) => {
		setTimeout(() => {
			console.log("Done!");
			res("Done!")
		}, 10000)
	})
};