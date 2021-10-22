import {TendermintEventType, TendermintSubscriptionResponse} from "../WebSocketClient";
import {BaseListener}                                        from "../BaseListener";

export default class DepositConfirmationListener extends BaseListener {

	constructor() {
		super();
	}

	public listen(axelarDepositAddress: string) {

		return new Promise(async (resolve, reject) => {

			await super.initialize();

			const event: TendermintEventType = "Tx";
			const query: any = {
				'transfer.recipient': axelarDepositAddress,
			};
			const handler = (data: TendermintSubscriptionResponse) => {
				console.log("recipient event", data); //TODO: find out what this looks like
				resolve(data);
			}

			super.subscribe(event, query, handler);

		});

	}

}