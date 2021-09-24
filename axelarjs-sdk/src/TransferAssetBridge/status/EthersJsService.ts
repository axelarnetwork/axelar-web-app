import {WaitingService} from "./WaitingService";

export default class EthersJsService extends WaitingService {

	constructor(depositAddress: string) {
		super(6, depositAddress);
		console.log(this.numConfirmations);
	}

	public wait() {
		console.log("todo: need to implement using ethers.js");
	}
}