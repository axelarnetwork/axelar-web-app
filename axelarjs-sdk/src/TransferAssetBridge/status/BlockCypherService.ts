import {WaitingService} from "./WaitingService";
import {poll}           from "./utils";

export default class BlockCypherService extends WaitingService {

	constructor(depositAddress: string) {
		super(6, depositAddress);
		console.log(this.numConfirmations);
	}

	public wait() {

		console.log("block cypher service is waiting");
		const fn = (attempts: number) => new Promise(r => {
			fetch("https://api.blockcypher.com/v1/btc/test3/addrs/moHY7VwRYhoNK5QwU4WpePWR8mhLb3DtpL").then((response: any) => response.json())
			.then((data: any) => {
				console.log("response data",data)
				r(attempts + 1)
			})
		});

		const validate = (res: number) => res > 6;
		const interval = 1000;
		const maxAttempts = 100;

		poll({fn, validate, interval, maxAttempts});

	}
}