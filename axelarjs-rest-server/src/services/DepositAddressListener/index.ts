import {TendermintEventType, TendermintSubscriptionResponse, WebSocketClient} from "./WebSocketClient";

export default class DepositAddressListener {

	private client: WebSocketClient;

	constructor() {
		const connectionString: string = process.env.WEBSOCKET_URL as string;
		console.log("websocket connection string: ", connectionString);
		this.client = new WebSocketClient(connectionString);
	}

	public startTendermintSocketForDepositAddress() {

		return new Promise(async (resolve, reject) => {

			await this.client.initialize();

			const event: TendermintEventType = "Tx";
			const query: any = {
				'message.module': 'bitcoin',
				'message.destinationChain': 'Ethereum'
			};
			const handler = (data: TendermintSubscriptionResponse) => {
				const destinationAddress: any = this.parseDestinationAddress(data);
				console.log("destination address",destinationAddress);
				resolve(destinationAddress);
				this.client.destroy();
			}

			this.client.subscribe(event, query, handler);

		});

	}

	private parseDestinationAddress(data: any): string {
		//TODO: ... is there a better (less brittle) way of doing this?
		return JSON.parse(data.value.TxResult.result.log)[0]
		.events[0]
		.attributes
		.find((attribute: any) => attribute.key === 'depositAddress')
		?.value;
	}
}