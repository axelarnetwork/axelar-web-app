import {WaitingService}          from "./WaitingService";
import {poll}                    from "./utils";
import {IDepositAddressResponse}             from "../../interface";
import {BlockCypherResponse, StatusResponse} from "../index";

export default class BlockCypherService extends WaitingService {

	constructor(depositAddress: string) {
		super(6, depositAddress);
		console.log(this.numConfirmations);
	}

	public wait(depositAddress: IDepositAddressResponse, cb?: StatusResponse) {
		console.log("block cypher service is polling", depositAddress.sourceTokenDepositAddress);
		const canhsBTCTestAddress: string = 'moHY7VwRYhoNK5QwU4WpePWR8mhLb3DtpL';
		const url = `https://api.blockcypher.com/v1/btc/test3/addrs/${canhsBTCTestAddress}`; //TODO: use a real deposit address in devnet
		const fn = (attempts: number) => new Promise(r => {
			fetch(url, {
				headers: {
					'Accept': "*/*"
				}
			})
			.then((response: any) => response.json())
			.then((data: BlockCypherResponse) => {
				cb && cb(data);
				r(data);
			})
		});

		const validate = (res: number) => res > 6;
		const interval = 2 * 60000; // every two minutes
		const maxAttempts = 50;

		poll({fn, validate, interval, maxAttempts});

	}
}