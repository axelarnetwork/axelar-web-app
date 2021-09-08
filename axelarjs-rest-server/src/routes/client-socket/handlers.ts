exports.hello = function () {

	this.emit("hello-back",'Hey there');
};

exports.newMessage = function (messageParam: string) {

	console.log('Got messageParam', messageParam);
};

exports.btc2evm = async function () {

	const res = await confirmBtcDeposit();

	this.emit("btc-result",res);
}

const confirmBtcDeposit = () => new Promise((res: any, rej: any) => setTimeout(() => {
	console.log("Done!");
	res("Done!")
}, 5000));